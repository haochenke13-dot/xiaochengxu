const services = require("../../utils/services");
const { getLocale, getPageTexts } = require("../../utils/i18n");

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
    categories: {}
  },

  onLoad() {
    const locale = getLocale();
    const seriesList = services.getMaterialSeries();
    const categories = services.getMaterialCategories();
    const defaultSeries = "venus";
    const modelsList = services.getMaterialModels(defaultSeries);
    const defaultModel = "venus100";
    const materials = services.getMaterials(defaultSeries, defaultModel);

    this.setData({
      locale,
      texts: getPageTexts("materials", locale),
      seriesList,
      categories,
      selectedSeries: defaultSeries,
      selectedModel: defaultModel,
      modelsList,
      materials,
      filteredMaterials: materials,
      selectedCategory: "all"
    });

    // 在设置categories后再构建类别列表
    const categoriesList = this.buildCategoriesList(materials);
    this.setData({
      categoriesList
    });
  },

  /**
   * 选择系列
   */
  onSeriesChange(e) {
    const seriesId = e.currentTarget.dataset.series;
    const modelsList = services.getMaterialModels(seriesId);
    this.setData({
      selectedSeries: seriesId,
      selectedModel: "",
      selectedCategory: "all",
      modelsList,
      materials: [],
      filteredMaterials: [],
      categoriesList: []
    });
  },

  /**
   * 选择型号
   */
  onModelChange(e) {
    const modelId = e.currentTarget.dataset.model;
    const materials = services.getMaterials(this.data.selectedSeries, modelId);
    const categoriesList = this.buildCategoriesList(materials);
    this.setData({
      selectedModel: modelId,
      selectedCategory: "all",
      materials,
      filteredMaterials: materials,
      categoriesList
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
  }
});
