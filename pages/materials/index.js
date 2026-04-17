const services = require("../../utils/services");
const { getLocale, getPageTexts } = require("../../utils/i18n");
const imageUrlsConfig = require("../../utils/image-urls");
const cart = require("../../utils/cart");
const mock = require("../../utils/mock");

Page({
  data: {
    locale: "zh",
    texts: {},
    seriesList: [],
    modelsList: [],
    materials: [],
    filteredMaterials: [],
    categoriesList: [],
    selectedSeries: "",
    selectedModel: "",
    selectedCategory: "all",
    categories: {},
    imageErrors: {}, // 记录加载失败的图片
    imageUrls: {}, // 存储图片URL
    cartCount: 0, // 购物车数量
    showCartBadge: false // 是否显示购物车角标
  },

  async onLoad() {
    const locale = getLocale();
    const seriesList = await services.getMaterialSeries();
    const categories = await services.getMaterialCategories();
    const defaultSeries = "venus";

    // 找到默认系列的数字ID
    const defaultSeriesObj = seriesList.find(s => s.id === defaultSeries);
    const defaultSeriesNum = defaultSeriesObj?.seriesNum;

    console.log('=== onLoad ===');
    console.log('默认系列:', defaultSeries, '数字ID:', defaultSeriesNum);
    console.log('seriesList:', seriesList);

    // 如果找不到数字ID，使用mock数据
    if (!defaultSeriesNum) {
      console.log('找不到默认系列的数字ID，使用mock数据');

      const models = mock.MATERIAL_MODELS[defaultSeries] || [];
      const materials = mock.MATERIALS['venus100'] || [];

      const materialsWithIds = materials.map(item => ({
        ...item,
        imageId: `img_${item.materialId}`
      }));

      // 设置图片URL
      const allImageUrls = { models: {}, parts: {} };
      models.forEach(model => {
        allImageUrls.models[model.id] = imageUrlsConfig.models[model.id] || `/assets/models/${model.id}.png`;
      });

      materialsWithIds.forEach(material => {
        allImageUrls.parts[material.materialId] = `/assets/parts/${material.materialId}.png`;
      });

      const categoriesList = this.buildCategoriesList(materialsWithIds);
      const cartCount = cart.getCartCount();

      this.setData({
        locale,
        texts: getPageTexts("materials", locale),
        seriesList,
        categories,
        selectedSeries: defaultSeries,
        selectedModel: "venus100",
        modelsList: models,
        materials: materialsWithIds,
        filteredMaterials: materialsWithIds,
        selectedCategory: "all",
        imageErrors: {},
        imageUrls: allImageUrls,
        categoriesList,
        cartCount,
        showCartBadge: cartCount > 0
      });

      console.log('Mock数据加载完成');
      return;
    }

    const modelsList = await services.getMaterialModels(defaultSeriesNum);
    console.log('=== onLoad - 型号列表 ===');
    console.log('型号列表:', modelsList);
    modelsList.forEach(model => {
      console.log(`型号: id=${model.id}, name=${model.name}, _raw.id=${model._raw?.id}`);
    });

    // 选择第一个型号作为默认型号
    const defaultModel = modelsList.length > 0 ? modelsList[0].id : "venus100";
    console.log('默认型号:', defaultModel);

    const materials = await services.getMaterials(defaultSeries, defaultModel);

    // 为每个物料添加唯一标识，用于图片错误处理
    const materialsWithIds = materials.map(item => ({
      ...item,
      imageId: `img_${item.materialId}`
    }));

    // 设置图片URL（包含型号和物料）
    const allImageUrls = {
      models: {},
      parts: {}
    };

    // 设置型号图片URL
    modelsList.forEach(model => {
      // 优先使用多种方式查找CDN配置：name、code、id
      const imageUrlByName = imageUrlsConfig.models[model.name];
      const imageUrlByCode = imageUrlsConfig.models[model.code];
      const imageUrlById = imageUrlsConfig.models[model.id];

      const finalUrl = imageUrlByName || imageUrlByCode || imageUrlById || `/assets/models/${model.name}.png`;

      allImageUrls.models[model.id] = finalUrl;

      console.log(`型号 ${model.name} (ID:${model.id}, code:${model.code}):`, {
        '按name查找': imageUrlByName ? '✓' : '✗',
        '按code查找': imageUrlByCode ? '✓' : '✗',
        '按id查找': imageUrlById ? '✓' : '✗',
        '最终URL': finalUrl.substring(0, 80) + '...'
      });
    });

    // 设置物料图片URL
    materialsWithIds.forEach(material => {
      // 处理不同格式的物料ID
      let materialImageUrl;
      if (imageUrlsConfig.partsBaseUrl) {
        // 对于数字ID（后端数据），补齐到6位
        if (/^\d+$/.test(material.materialId)) {
          const materialImageId = material.materialId?.padStart(6, '0');
          materialImageUrl = `${imageUrlsConfig.partsBaseUrl}${materialImageId}.png`;
        } else {
          // 对于字符串ID（mock数据，如 "MT-V100-001"），直接使用
          materialImageUrl = `${imageUrlsConfig.partsBaseUrl}${material.materialId}.png`;
        }
      } else {
        // 降级到本地路径
        materialImageUrl = `/assets/parts/${material.materialId}.png`;
      }

      allImageUrls.parts[material.materialId] = materialImageUrl;
      console.log(`物料 ${material.materialId}:`, materialImageUrl);
    });

    this.setData({
      locale,
      texts: getPageTexts("materials", locale),
      seriesList,
      categories,
      selectedSeries: defaultSeries,
      selectedModel: defaultModel,
      modelsList,
      materials: materialsWithIds,
      filteredMaterials: materialsWithIds,
      selectedCategory: "all",
      imageErrors: {},
      imageUrls: allImageUrls
    });

    // 在设置categories后再构建类别列表
    const categoriesList = this.buildCategoriesList(materialsWithIds);

    // 更新购物车数量
    const cartCount = cart.getCartCount();

    this.setData({
      categoriesList,
      cartCount,
      showCartBadge: cartCount > 0
    });

    // 调试输出：检查CDN链接配置
    console.log('=== imageUrlsConfig导入检查 ===');
    console.log('imageUrlsConfig:', imageUrlsConfig);
    console.log('imageUrlsConfig.models:', imageUrlsConfig.models);
    console.log('smart500 CDN链接:', imageUrlsConfig.models?.smart500);
    console.log('完整imageUrls:', allImageUrls);
  },

  /**
   * 选择系列
   */
  async onSeriesChange(e) {
    const seriesId = e.currentTarget.dataset.series;
    console.log('=== onSeriesChange ===');
    console.log('选中的series code:', seriesId);

    // 检查是否有token
    const hasToken = require('../../utils/request').getToken();
    let modelsList;

    if (hasToken) {
      // 有token：使用数字ID调用真实API
      const selectedSeries = this.data.seriesList.find(s => s.id === seriesId);
      const seriesNum = selectedSeries?.seriesNum;
      console.log('series数字ID:', seriesNum);
      modelsList = await services.getMaterialModels(seriesNum);
    } else {
      // 没有token：直接使用字符串code获取mock数据
      console.log('使用mock数据，series code:', seriesId);
      modelsList = mock.MATERIAL_MODELS[seriesId] || [];
    }

    console.log('获取到的型号列表:', modelsList);

    // 设置图片URL
    const modelImageUrls = { models: {}, parts: {} };
    modelsList.forEach(model => {
      // 优先使用多种方式查找CDN配置：name、code、id
      const imageUrlByName = imageUrlsConfig.models[model.name];
      const imageUrlByCode = imageUrlsConfig.models[model.code];
      const imageUrlById = imageUrlsConfig.models[model.id];

      const finalUrl = imageUrlByName || imageUrlByCode || imageUrlById || `/assets/models/${model.name}.png`;

      modelImageUrls.models[model.id] = finalUrl;
      console.log(`型号 ${model.name} (code:${model.code}):`, {
        '按name查找': imageUrlByName ? '✓' : '✗',
        '按code查找': imageUrlByCode ? '✓' : '✗',
        '按id查找': imageUrlById ? '✓' : '✗',
        '最终URL': finalUrl.substring(0, 60) + '...'
      });
    });

    this.setData({
      selectedSeries: seriesId,
      selectedModel: "",
      selectedCategory: "all",
      modelsList,
      materials: [],
      filteredMaterials: [],
      categoriesList: [],
      imageUrls: modelImageUrls
    });
  },

  /**
   * 选择型号
   */
  async onModelChange(e) {
    const modelId = e.currentTarget.dataset.model;
    const materials = await services.getMaterials(this.data.selectedSeries, modelId);
    const categoriesList = this.buildCategoriesList(materials);

    // 为每个物料添加唯一标识，用于图片错误处理
    const materialsWithIds = materials.map(item => ({
      ...item,
      imageId: `img_${item.materialId}`
    }));

    this.setData({
      selectedModel: modelId,
      selectedCategory: "all",
      materials: materialsWithIds,
      filteredMaterials: materialsWithIds,
      categoriesList,
      imageErrors: {}
    });
  },

  /**
   * 选择类别
   */
  onCategoryChange(e) {
    const categoryKey = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: categoryKey
    });

    this.filterMaterials();
  },

  /**
   * 构建类别列表
   */
  buildCategoriesList(materials) {
    const categories = this.data.categories;
    const locale = this.data.locale;

    // 统计各类别数量
    const counts = {};
    counts.all = materials.length;

    Object.keys(categories).forEach(key => {
      counts[key] = materials.filter(item => item.category === key).length;
    });

    // 构建类别列表
    const list = [
      {
        key: 'all',
        name: locale === 'zh' ? '全部' : 'All',
        count: counts.all || 0
      }
    ];

    Object.keys(categories).forEach(key => {
      const cat = categories[key];
      list.push({
        key: key,
        name: locale === 'zh' ? cat.name : cat.nameEn,
        count: counts[key] || 0
      });
    });

    return list;
  },

  /**
   * 筛选物料
   */
  filterMaterials() {
    const { materials, selectedCategory } = this.data;

    if (selectedCategory === 'all') {
      this.setData({
        filteredMaterials: materials
      });
    } else {
      this.setData({
        filteredMaterials: materials.filter(item => item.category === selectedCategory)
      });
    }
  },

  /**
   * 图片加载失败处理
   */
  onImageError(event) {
    const imageId = event.currentTarget.dataset.imageid;
    const imageErrors = this.data.imageErrors || {};

    console.log('零件图片加载失败:', imageId);

    // 记录加载失败的图片
    imageErrors[imageId] = true;
    this.setData({ imageErrors });
  },

  /**
   * 型号图片加载失败处理
   */
  onModelImageError(event) {
    const modelId = event.currentTarget.dataset.modelId;
    const imageErrors = this.data.imageErrors || {};

    // 记录加载失败的图片
    imageErrors[modelId] = true;
    this.setData({ imageErrors });
  },

  /**
   * 添加到购物车
   */
  addToCart(event) {
    const { material } = event.currentTarget.dataset;

    // 添加到购物车
    const updatedCart = cart.addItem(material, 1);

    // 更新购物车数量
    this.setData({
      cartCount: updatedCart.totalQuantity,
      showCartBadge: updatedCart.totalQuantity > 0
    });

    // 显示提示
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1500
    });

    // 触发震动反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  /**
   * 跳转到购物车页面
   */
  goToCart() {
    if (this.data.cartCount === 0) {
      wx.showToast({
        title: '购物车是空的',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/cart/index'
    });
  },

  /**
   * 页面显示时更新购物车数量
   */
  onShow() {
    const cartCount = cart.getCartCount();
    this.setData({
      cartCount,
      showCartBadge: cartCount > 0
    });
  }
});
