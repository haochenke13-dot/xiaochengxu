const services = require("../../utils/services");
const { getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    locale: "zh",
    texts: {},
    seriesList: [],
    modelsList: [],
    materials: [],
    selectedSeries: "",
    selectedModel: "",
    categories: {}
  },

  onLoad() {
    const locale = getLocale();
    this.setData({
      locale,
      texts: getPageTexts("materials", locale),
      seriesList: services.getMaterialSeries(),
      categories: services.getMaterialCategories()
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
      modelsList,
      materials: []
    });
  },

  /**
   * 选择型号
   */
  onModelChange(e) {
    const modelId = e.currentTarget.dataset.model;
    const materials = services.getMaterials(this.data.selectedSeries, modelId);
    this.setData({
      selectedModel: modelId,
      materials
    });
  }
});
