#include "order_book.hpp"
#include <algorithm>

void OrderBook::addBid(int price, int quantity) {
    bids_.emplace_back(price, quantity);
    // Sort by price descending (highest bid first)
    std::sort(bids_.begin(), bids_.end(), [](const Order& a, const Order& b) {
        return a.price > b.price;
    });
}

void OrderBook::addAsk(int price, int quantity) {
    asks_.emplace_back(price, quantity);
    // Sort by price ascending (lowest ask first)
    std::sort(asks_.begin(), asks_.end(), [](const Order& a, const Order& b) {
        return a.price < b.price;
    });
}

void OrderBook::clear() {
    bids_.clear();
    asks_.clear();
}
