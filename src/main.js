/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
   if (!data 
        || !Array.isArray(data._product) 
        || data._product.length === 0
    ) {
        throw new Error('Некорректные входные данные');
    }
   const { discount, sale_price, quantity } = purchase;
   const decimalDiscount = (1 - purchase.discount / 100);
   const FullCostProd = purchase.sale_price * purchase.quantity;
   return FullCostProd * decimalDiscount; 
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const { profit } = seller;
    if (!data 
        || !Array.isArray(data.sellers) 
        || data.sellers.length === 0
    ) {
        throw new Error('Некорректные входные данные');
    }
     if (index === 0) {
        return profit * 0.15; // 15% для первого места
    } else if (index === 1 || index === 2) {
        return profit * 0.10; // 10% для второго и третьего места
    } else if (index === total - 1) {
        return 0; // 0% для последнего места
    } else {
        return profit * 0.05; // 5% для всех остальных, кроме последнего
    }
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {

    // @TODO: Проверка входных данных
    const { calculateRevenue, calculateBonus } = options;

    // @TODO: Проверка наличия опций
    if (typeof calculateRevenue !== "function") {
    throw new Error("Функция calculateRevenue не определена");
}
    if (typeof calculateBonus !== "function") {
    throw new Error("Функция calculateBonus не определена");
}
    // @TODO: Подготовка промежуточных данных для сбора статистики
    const sellerStats = data.sellers.map(seller => ({
   // Заполним начальными данными
})); 

    // @TODO: Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = Object.fromEntries(data.sellers.map(seller => [seller.id, seller]));
    const productIndex = Object.fromEntries(data.products.map(product => [product.sku, product]));

    // @TODO: Расчет выручки и прибыли для каждого продавца
    data.purchase_records.forEach(record => { // Чек 
        const seller = sellerIndex[record.seller_id]; // Продавец
        seller.sales_count += 1;
        seller.record =+ record.total_amount;

        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku]; // Товар
            const cost = product.purchase_price * item.quantity;
            const revenue = calculateSimpleRevenue(item, product);
            // Посчитать прибыль: выручка минус себестоимость
            const selfCost = product.purchase_price * product.quantity;
            const profitProd = revenue - selfCost;
        // Увеличить общую накопленную прибыль (profit) у продавца  

            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
        });
 }); 

    // @TODO: Сортировка продавцов по прибыли

    // Сортируем продавцов по прибыли
    sellerStats.sort(/*функция сортировки*/);

    // @TODO: Назначение премий на основе ранжирования
    sellerStats.forEach((seller, index) => {
        seller.bonus = // Считаем бонус
        seller.top_products = 
    Object.entries(seller.products_sold)
    .map(([sku, quantity]) => ({ sku, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
}); 
    // @TODO: Подготовка итоговой коллекции с нужными полями
    return sellerStats.map(seller => ({
    seller_id: seller.id,
    name: `${seller.first_name} ${seller.last_name}`,
    revenue: +seller.revenue.toFixed(2),
    profit: +seller.profit.toFixed(2),
    sales_count: seller.sales_count,
    top_products: seller.top_products,
    bonus: +seller.bonus.toFixed(2)
}));
}
