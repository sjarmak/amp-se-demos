#include <gtest/gtest.h>
#include "order_book.hpp"

TEST(OrderBookTest, BidsAreSortedByPriceDesc) {
    OrderBook book;
    book.addBid(100, 10);
    book.addBid(200, 20);
    book.addBid(150, 15);
    
    const auto& bids = book.getBids();
    EXPECT_EQ(bids[0].price, 200);
    EXPECT_EQ(bids[1].price, 150);
    EXPECT_EQ(bids[2].price, 100);
}

TEST(OrderBookTest, AsksAreSortedByPriceAsc) {
    OrderBook book;
    book.addAsk(200, 20);
    book.addAsk(100, 10);
    book.addAsk(150, 15);
    
    const auto& asks = book.getAsks();
    EXPECT_EQ(asks[0].price, 100);
    EXPECT_EQ(asks[1].price, 150);
    EXPECT_EQ(asks[2].price, 200);
}
