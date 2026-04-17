const services = require("../../utils/services");
const { getLocale, getPageTexts } = require("../../utils/i18n");
const imageUrlsConfig = require("../../utils/image-urls");
const cart = require("../../utils/cart");

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
    const modelsList = await services.getMaterialModels(defaultSeries);
    const defaultModel = "venus100";
    const materials = await services.getMaterials(defaultSeries, defaultModel);

    // 为每个物料添加唯一标识，用于图片错误处理
    const materialsWithIds = materials.map(item => ({
      ...item,
      imageId: `img_${item.materialId}`
    }));

    // 设置图片URL
    const modelImageUrls = { models: {} };
    modelsList.forEach(model => {
      modelImageUrls.models[model.id] = imageUrlsConfig.models[model.id] || `/assets/models/${model.id}.png`;
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
      imageUrls: modelImageUrls
    });

    // 调试输出：检查CDN链接配置
    console.log('=== imageUrlsConfig导入检查 ===');
    console.log('imageUrlsConfig:', imageUrlsConfig);
    console.log('imageUrlsConfig.models:', imageUrlsConfig.models);
    console.log('smart500 CDN链接:', imageUrlsConfig.models?.smart500);
    console.log('完整imageUrls:', modelImageUrls);

    // 在设置categories后再构建类别列表
    const categoriesList = this.buildCategoriesList(materialsWithIds);

    // 更新购物车数量
    const cartCount = cart.getCartCount();

    this.setData({
      categoriesList,
      cartCount,
      showCartBadge: cartCount > 0
    });
  },

  /**
   * 选择系列
   */
  async onSeriesChange(e) {
    const seriesId = e.currentTarget.dataset.series;
    const modelsList = await services.getMaterialModels(seriesId);

    // 设置图片URL
    const modelImageUrls = { models: {} };
    modelsList.forEach(model => {
      modelImageUrls.models[model.id] = imageUrlsConfig.models[model.id] || `/assets/models/${model.id}.png`;
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
