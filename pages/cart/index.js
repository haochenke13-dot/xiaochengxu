/**
 * 购物车结算页面
 * 类似美团的购物车结算界面
 */
const cart = require("../../utils/cart");

Page({
  data: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    isEmpty: true
  },

  onLoad() {
    this.loadCart();
  },

  onShow() {
    this.loadCart();
  },

  /**
   * 加载购物车数据
   */
  loadCart() {
    const cartData = cart.getCart();

    this.setData({
      cartItems: cartData.items,
      totalQuantity: cartData.totalQuantity,
      totalPrice: cartData.totalPrice,
      isEmpty: cartData.items.length === 0
    });
  },

  /**
   * 增加商品数量
   */
  increaseItem(event) {
    const { materialId } = event.currentTarget.dataset;
    const updatedCart = cart.increaseQuantity(materialId);
    this.updateCartDisplay(updatedCart);
  },

  /**
   * 减少商品数量
   */
  decreaseItem(event) {
    const { materialId } = event.currentTarget.dataset;
    const updatedCart = cart.decreaseQuantity(materialId);
    this.updateCartDisplay(updatedCart);
  },

  /**
   * 删除商品
   */
  removeItem(event) {
    const { materialId } = event.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要从购物车中删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          const updatedCart = cart.removeItem(materialId);
          this.updateCartDisplay(updatedCart);

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 清空购物车
   */
  clearCart() {
    if (this.data.isEmpty) return;

    wx.showModal({
      title: '确认清空',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          cart.clearCart();
          this.loadCart();

          wx.showToast({
            title: '购物车已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 更新购物车显示
   */
  updateCartDisplay(cartData) {
    this.setData({
      cartItems: cartData.items,
      totalQuantity: cartData.totalQuantity,
      totalPrice: cartData.totalPrice,
      isEmpty: cartData.items.length === 0
    });
  },

  /**
   * 提交订单
   */
  submitOrder() {
    if (this.data.isEmpty) {
      wx.showToast({
        title: '购物车是空的',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认提交',
      content: `确定要提交 ${this.data.totalQuantity} 个商品的订单吗？\n总价: ¥${this.data.totalPrice.toFixed(2)}`,
      success: (res) => {
        if (res.confirm) {
          // 这里可以调用实际的订单提交API
          // 暂时只做演示
          this.processOrder();
        }
      }
    });
  },

  /**
   * 处理订单提交
   */
  processOrder() {
    wx.showLoading({
      title: '提交中...',
      mask: true
    });

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading();

      wx.showModal({
        title: '提交成功',
        content: '订单已提交，我们将尽快处理！',
        showCancel: false,
        success: () => {
          // 清空购物车
          cart.clearCart();
          this.loadCart();

          // 返回上一页
          wx.navigateBack();
        }
      });
    }, 1500);
  },

  /**
   * 返回物料页面继续添加
   */
  continueShopping() {
    wx.navigateBack();
  }
});
