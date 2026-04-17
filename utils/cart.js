/**
 * 购物车管理工具
 * 类似美团点单的购物车功能
 */

const CART_KEY = 'materials_cart';

/**
 * 获取购物车数据
 */
function getCart() {
  try {
    const cart = wx.getStorageSync(CART_KEY);
    return cart || { items: [], totalQuantity: 0, totalPrice: 0 };
  } catch (e) {
    console.error('获取购物车失败:', e);
    return { items: [], totalQuantity: 0, totalPrice: 0 };
  }
}

/**
 * 保存购物车数据
 */
function saveCart(cart) {
  try {
    wx.setStorageSync(CART_KEY, cart);
    return true;
  } catch (e) {
    console.error('保存购物车失败:', e);
    return false;
  }
}

/**
 * 添加商品到购物车
 * @param {Object} material - 物料信息
 * @param {Number} quantity - 数量，默认为1
 */
function addItem(material, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.items.find(item => item.materialId === material.materialId);

  if (existingItem) {
    // 如果已存在，增加数量
    existingItem.quantity += quantity;
    existingItem.totalPrice = existingItem.quantity * existingItem.price;
  } else {
    // 如果不存在，添加新项
    const price = parseFloat(material.price?.replace('¥', '') || material.price || 0);
    cart.items.push({
      materialId: material.materialId,
      name: material.name,
      spec: material.spec,
      price: price,
      quantity: quantity,
      totalPrice: price * quantity,
      category: material.category,
      imageUrl: material.imageUrl || ''
    });
  }

  // 重新计算总计
  recalculateTotal(cart);

  // 保存购物车
  saveCart(cart);

  return cart;
}

/**
 * 移除商品
 * @param {String} materialId - 物料ID
 */
function removeItem(materialId) {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.materialId !== materialId);

  // 重新计算总计
  recalculateTotal(cart);

  // 保存购物车
  saveCart(cart);

  return cart;
}

/**
 * 更新商品数量
 * @param {String} materialId - 物料ID
 * @param {Number} quantity - 新数量
 */
function updateQuantity(materialId, quantity) {
  const cart = getCart();
  const item = cart.items.find(item => item.materialId === materialId);

  if (item) {
    if (quantity <= 0) {
      // 如果数量为0，移除商品
      return removeItem(materialId);
    } else {
      // 更新数量
      item.quantity = quantity;
      item.totalPrice = item.quantity * item.price;

      // 重新计算总计
      recalculateTotal(cart);

      // 保存购物车
      saveCart(cart);
    }
  }

  return cart;
}

/**
 * 增加商品数量
 * @param {String} materialId - 物料ID
 */
function increaseQuantity(materialId) {
  const cart = getCart();
  const item = cart.items.find(item => item.materialId === materialId);

  if (item) {
    return updateQuantity(materialId, item.quantity + 1);
  }

  return cart;
}

/**
 * 减少商品数量
 * @param {String} materialId - 物料ID
 */
function decreaseQuantity(materialId) {
  const cart = getCart();
  const item = cart.items.find(item => item.materialId === materialId);

  if (item) {
    return updateQuantity(materialId, item.quantity - 1);
  }

  return cart;
}

/**
 * 清空购物车
 */
function clearCart() {
  const emptyCart = { items: [], totalQuantity: 0, totalPrice: 0 };
  saveCart(emptyCart);
  return emptyCart;
}

/**
 * 重新计算总计
 */
function recalculateTotal(cart) {
  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
}

/**
 * 获取购物车数量
 */
function getCartCount() {
  const cart = getCart();
  return cart.totalQuantity;
}

/**
 * 获取购物车总价
 */
function getCartTotal() {
  const cart = getCart();
  return cart.totalPrice;
}

/**
 * 格式化价格显示
 */
function formatPrice(price) {
  return `¥${price.toFixed(2)}`;
}

module.exports = {
  getCart,
  addItem,
  removeItem,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  getCartCount,
  getCartTotal,
  formatPrice
};
