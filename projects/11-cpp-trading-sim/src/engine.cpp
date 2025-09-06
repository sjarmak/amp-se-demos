#include "engine.hpp"
#include <algorithm>

void TradingEngine::addOrder(const std::string& symbol, Side side, int quantity, int price_cents) {
    auto& book = books_[symbol];
    
    if (side == Side::BUY) {
        book.addBid(price_cents, quantity);
    } else {
        book.addAsk(price_cents, quantity);
    }
    
    // Intentional: basic matching algorithm with room for optimization
    matchOrders(symbol);
}

void TradingEngine::matchOrders(const std::string& symbol) {
    auto& book = books_[symbol];
    
    // Simple crossing logic - can be optimized
    auto bids = book.getBids();
    auto asks = book.getAsks();
    
    for (const auto& bid : bids) {
        for (const auto& ask : asks) {
            if (bid.price >= ask.price) {
                // Match found - basic implementation
                int trade_qty = std::min(bid.quantity, ask.quantity);
                // TODO: Actually execute the trade and update book
                break;
            }
        }
    }
}

const OrderBook& TradingEngine::getBook(const std::string& symbol) const {
    static OrderBook empty;
    auto it = books_.find(symbol);
    return it != books_.end() ? it->second : empty;
}
