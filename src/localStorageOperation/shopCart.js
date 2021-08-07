/**
 * 这里的方法专注于数据处理
 * 所有操作local的方法都会放在这里
 * 由处理DOM的文件面对这里
 */

if (!localStorage.getItem('shopIid')) {
	localStorage.setItem('shopIid', '0');
}

if (!localStorage.getItem('productIid')) {
	localStorage.setItem('productIid', '0');
}

if (!localStorage.getItem('cartList')) {
	localStorage.setItem('cartList', JSON.stringify([]));
}

export const cartList = JSON.parse(localStorage.getItem('cartList'));

/* 删除操作 */

// 删除商品
export function deleteProductData(shopIid, productIid) {
	const { index: shopIndex } = getShopData(shopIid);
	const { index: productIndex } = getProductData(shopIid, productIid);

	cartList[shopIndex].productList.splice(productIndex, 1);
	changeCartList();
}

// 删除店铺
export function deleteShopData(shopIid) {
	const { index } = getShopData(shopIid);

	cartList.splice(index, 1);

	changeCartList();
}

export function deleteAll() {
	cartList.splice(0);

	changeCartList();
}

export function deleteSelectedData() {
	cartList.splice(
		0,
		cartList.length,
		...cartList.filter((shop) => {
			shop.productList = shop.productList.filter(({ select }) => !select);

			if (shop.productList.length) return true;
			else return false;
		})
	);

	changeCartList();
}

/* 更改操作 */

// 更改shop数据
export function changeShopData(shopIid, key, value) {
	const { shop } = getShopData(shopIid);

	shop[key] = value;

	changeCartList();
}

// 更改product数据
export function changeProductData(shopIid, productIid, key, value) {
	const { shop } = getShopData(shopIid);
	const { product } = getProductData(shopIid, productIid);

	product[key] = value;

	changeCartList();
}

// 检测shop下的商品列表有没有选中的商品
export function shopHasSelectProduct(shopIid) {
	return getShopData(shopIid).shop.productList.some(({ select }) => select);
}

// 更新cartList
export function changeCartList() {
	localStorage.setItem('cartList', JSON.stringify(cartList));
}

// 全选商品
export function changeSelectAll(value) {
	cartList.forEach((shop) => {
		shop.select = value;

		shop.productList.forEach((product) => {
			product.select = value;
		});
	});

	changeCartList();
}

function changeShopIid(value) {
	localStorage.setItem('shopIid', JSON.stringify(value));
}

function changeProductIid(value) {
	localStorage.setItem('productIid', JSON.stringify(value));
}

/* 添加操作 */

export function addNewProductData(index) {
	if (index < 0 || index >= cartList.length) return;

	cartList[index].productList.push(getProductDefaultTemplate());

	changeCartList();
}

export function addNewShopData() {
	cartList.push(getShopDefaultTemplate());

	changeCartList();
}

/* 获取操作 */

// 获取shop数据
export function getShopData(shopIid) {
	shopIid = Number(shopIid);

	return {
		shop: cartList.find(({ shopIid: iid }) => shopIid === iid),
		index: cartList.findIndex(({ shopIid: iid }) => shopIid === iid),
	};
}

// 获取product数据
export function getProductData(shopIid, productIid) {
	shopIid = Number(shopIid);
	productIid = Number(productIid);

	const { shop } = getShopData(shopIid);

	return {
		product: shop.productList.find(
			({ productIid: iid }) => productIid === iid
		),
		index: shop.productList.findIndex(
			({ productIid: iid }) => productIid === iid
		),
	};
}

function getProductDefaultTemplate() {
	const productIid = getProductIid() + 1;

	changeProductIid(productIid);
	return {
		productIid,
		title: '某品牌空气显卡',
		unitPrice: 123.23,
		select: false,
		num: 1,
		stock: true,
		specifications: '究极至尊黄钻qq会员魔力空气',
	};
}

function getShopDefaultTemplate() {
	const shopIid = getShopIid() + 1;

	changeShopIid(shopIid);
	return {
		shopIid,
		title: '某东官方旗舰店',
		select: true,

		productList: [getProductDefaultTemplate()],
	};
}

function getShopIid() {
	return Number(localStorage.getItem('shopIid'));
}

function getProductIid() {
	return Number(localStorage.getItem('productIid'));
}

/* 其他操作 */

// 检测是否全选
export function IsSelectAll() {
	if (!cartList.length) return false;

	return cartList.every(({ productList }) =>
		productList.every(({ select }) => select === true)
	);
}

export function getTotal() {
	return cartList.reduce(
		(num, { productList, select }) => {
			if (!select) return num;

			return (
				num +
				productList.reduce((total, { num, unitPrice, select }) => {
					if (!select) return total;

					return total + num * unitPrice;
				}, 0)
			);
		},

		0
	);
}
