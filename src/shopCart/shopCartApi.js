import 'bootstrap/dist/css/bootstrap.min.css';

import {
	getShopData,
	changeProductData,
	shopHasSelectProduct,
	changeShopData,
	getProductData,
	deleteProductData,
	deleteShopData,
	IsSelectAll,
	changeSelectAll,
	addNewProductData,
	addNewShopData,
	deleteAll,
	deleteSelectedData,
	cartList,
	getTotal,
} from '../localStorageOperation/shopCart.js';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Tooltip } from 'bootstrap';

import navRender from '../commonTemplate/nav/nav.js';
import shopTitleRender from './shopTitle/shopTitle.js';
import shopItemRender from './shopItem/shopItem.js';
import shopBottomRender from './shopBottom/shopBottom.js';

navRender('.nav');

// 初始化元素
export function initElement() {
	initTitle();
	initItem();
	initBottom();
	initOperation();
}

/* 设置元素事件 */

function initTitle() {
	shopTitleRender('.shop-cart-title');
	setSelectAllEvent();
}

function initItem() {
	shopItemRender('.shop-cart-list', { cartList });

	$('.shop-item').each(function (shopIndex) {
		const shop = $(this);
		const shopIid = cartList[shopIndex].shopIid;

		shop.attr('data-shopIid', shopIid);

		shop.children('.product-list')
			.children()
			.each(function (productIndex) {
				const product = $(this);
				const { productIid, select, num } =
					cartList[shopIndex].productList[productIndex];

				product.attr('data-productIid', productIid);

				changeProductSelect(shopIid, productIid, select);

				changeProductNum(shopIid, productIid, num);
			});
	});

	setShopSelectEvent();
	setProductSelectEvent();
	setProductChangeNumEvent();
	setProductDeleteEvent();

	updateSelectAll();
}

function initBottom() {
	shopBottomRender('.shop-cart-bottom');
	setCleaner();
	setDeleteSelected();

	updateTotal();
}

function initOperation() {
	$('.operation-desk')
		.children()
		.each(function () {
			new Tooltip(this);
		});

	setAddNewProductEvent();
	setAddNewShopEvent();
}

// 设置店家选中的点击事件
function setShopSelectEvent() {
	$('.shop-item-select-button').click(function () {
		const { shopIid } = getShopAndProductIid(this);
		const value = !getShopData(shopIid).shop.select;

		changeShopSelect(shopIid, value);
		updateSelectAll();
		updateTotal();
	});
}

function changeShopSelect(shopIid, value) {
	const shopSelectEl = getShopChildrenEl(
		shopIid,
		'.shop-item-select-button'
	)[0];
	const productListEl = getShopChildrenEl(
		shopIid,
		'.product-list'
	).children();

	changeShopData(shopIid, 'select', value);
	shopSelectEl.checked = value;

	productListEl.each(function () {
		const { productIid } = getShopAndProductIid(this);

		changeProductData(shopIid, productIid, 'select', value);
		$(this).find('.product-item-select-button')[0].checked = value;
	});
}

// 设置商品选中的点击事件
function setProductSelectEvent() {
	$('.product-item-select-button').click(function () {
		const { shopIid, productIid } = getShopAndProductIid(this);
		const value = !getProductData(shopIid, productIid).product.select;

		changeProductSelect(shopIid, productIid, value);
		updateSelectAll();
		updateTotal();
	});
}

function changeProductSelect(shopIid, productIid, value) {
	const proSelectEl = getProductChildrenEl(
		shopIid,
		productIid,
		'.product-item-select-button'
	)[0];
	const shopSelectEl = getShopChildrenEl(
		shopIid,
		'.shop-item-select-button'
	)[0];

	changeProductData(shopIid, productIid, 'select', value);

	proSelectEl.checked = value;

	if (shopHasSelectProduct(shopIid)) {
		shopSelectEl.checked = true;
		changeShopData(shopIid, 'select', true);
	} else {
		shopSelectEl.checked = false;
		changeShopData(shopIid, 'select', false);
	}
}

// 设置改变商品数量的点击事件
function setProductChangeNumEvent() {
	$('.product-item-quantity-stepper-reduce').click(function () {
		const value = Number(
			$(this).siblings('.product-item-quantity-stepper-num')[0].value
		);
		const { shopIid, productIid } = getShopAndProductIid(this);

		changeProductNum(shopIid, productIid, value - 1);
		updateTotal();
	});

	$('.product-item-quantity-stepper-plus').click(function () {
		const { shopIid, productIid } = getShopAndProductIid(this);
		const value = Number(
			$(this).siblings('.product-item-quantity-stepper-num')[0].value
		);

		changeProductNum(shopIid, productIid, value + 1);
		updateTotal();
	});

	$('.product-item-quantity-stepper-num').blur(function () {
		const { shopIid, productIid } = getShopAndProductIid(this);
		let value = Number(this.value);

		if (this.value <= 0) {
			value = 1;
		}

		changeProductNum(shopIid, productIid, value);
		updateTotal();
	});

	$('.product-item-quantity-stepper-num').keydown(function ({ keyCode }) {
		if (keyCode !== 13) return;
		this.blur();
	});
}

// 改变商品数量
function changeProductNum(shopIid, productIid, value) {
	const numEl = getProductChildrenEl(
		shopIid,
		productIid,
		'.product-item-quantity-stepper-num'
	);
	const reduceEl = numEl.siblings('.product-item-quantity-stepper-reduce');
	const subtotalEl = numEl
		.parents('[data-productiid]')
		.children('.product-item-subtotal');
	const { unitPrice } = getProductData(shopIid, productIid).product;

	if (value <= 1) {
		reduceEl.addClass('product-item-quantity-stepper-not-allowed');
	} else {
		reduceEl.removeClass('product-item-quantity-stepper-not-allowed');
	}

	if (value <= 0) {
		return;
	}

	changeProductData(shopIid, productIid, 'num', value);
	numEl[0].value = value;
	subtotalEl.text(`￥ ${value * unitPrice}`);
}

// 设置删除商品的点击事件
function setProductDeleteEvent() {
	$('.product-item-operation-delete').click(function () {
		const { shopIid, productIid } = getShopAndProductIid(this);
		const productEl = getProductEl(shopIid, productIid);
		const shopEl = getShopEl(shopIid);

		deleteProductData(shopIid, productIid);
		productEl.remove();

		if (!getShopData(shopIid).shop.productList.length) {
			deleteShopData(shopIid);
			shopEl.remove();
		}

		updateSelectAll();
		updateTotal();
	});
}

// 设置全选事件
function setSelectAllEvent() {
	$('.title-select-all-button').click(function () {
		if (!cartList.length) {
			this.checked = false;
		}

		const value = !IsSelectAll();

		changeSelectAll();

		$('.shop-item').each(function () {
			changeShopSelect($(this).attr('data-shopiid'), value);
		});

		updateSelectAll();
		updateTotal();
	});
}

// 设置添加新商品事件
function setAddNewProductEvent() {
	$('.add-product-shopiid').keydown(function ({ keyCode }) {
		if (keyCode !== 13) return;
		const value = this.value;

		if (this.value > cartList.length) return;

		addNewProductData(value - 1);
		location.reload();
	});

	$('.add-product').click(function () {
		const value = $('.add-product-shopiid')[0].value;

		if (value > cartList.length) return;

		addNewProductData(value - 1);
		location.reload();
	});
}

function setAddNewShopEvent() {
	$('.add-shop').click(function () {
		addNewShopData();
		location.reload();
	});
}

function setCleaner() {
	$('.shop-cart-bottom-left-cleaner').click(function () {
		deleteAll();
		$('.shop-cart-list').empty();
		updateSelectAll();
		updateTotal();
	});
}

function setDeleteSelected() {
	$('.shop-cart-bottom-left-batch-delete').click(function () {
		deleteSelectedData();

		$('.product-item').each(function () {
			const { shopIid } = getShopAndProductIid(this);
			const selectEl = $(this).find('.product-item-select-button')[0];
			const productItemListEl = $(this).siblings();

			if (selectEl.checked) {
				$(this).remove();

				if (!productItemListEl.length) {
					getShopEl(shopIid).remove();
				}
			}
		});

		updateSelectAll();
		updateTotal();
	});
}

/**
 * 工具函数
 */

// 获取操作元素的商品的shopIid和productIid
function getShopAndProductIid(el) {
	return {
		shopIid:
			$(el).attr('data-shopIid') ||
			$(el).parents('[data-shopIid]').attr('data-shopIid'),
		productIid:
			$(el).attr('data-productIid') ||
			$(el).parents('[data-productIid]').attr('data-productIid'),
	};
}

function getProductChildrenEl(shopIid, productIid, selector) {
	return $(`[data-shopiid=${shopIid}]`)
		.find(`[data-productiid=${productIid}]`)
		.find(selector);
}

function getShopChildrenEl(shopIid, selector) {
	return $(`[data-shopiid=${shopIid}]`).find(selector);
}

function getProductEl(shopIid, productIid) {
	return $(`[data-shopiid=${shopIid}]`).find(
		`[data-productiid=${productIid}]`
	);
}

function getShopEl(shopIid) {
	return $(`[data-shopiid=${shopIid}]`);
}

// 检测并更改全选
function updateSelectAll() {
	if (IsSelectAll()) {
		$('.title-select-all-button')[0].checked = true;
	} else {
		$('.title-select-all-button')[0].checked = false;
	}
}

function updateTotal() {
	$('.shop-cart-bottom-right-total-price-text').text(`￥ ${getTotal()}`);
}
