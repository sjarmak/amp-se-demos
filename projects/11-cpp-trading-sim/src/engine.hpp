#pragma once
#include <string>
#include <unordered_map>
#include "order_book.hpp"

enum class Side { BUY, SELL };

class TradingEngine {
private:
    std::unordered_map<std::string, OrderBook> books_;
    
public:
    void addOrder(const std::string& symbol, Side side, int quantity, int price_cents);
    void matchOrders(const std::string& symbol);
    const OrderBook& getBook(const std::string& symbol) const;
};
