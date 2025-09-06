#include <iostream>
#include <chrono>
#include "engine.hpp"

int main() {
    TradingEngine engine;
    
    auto start = std::chrono::high_resolution_clock::now();
    
    // Simulate some orders
    engine.addOrder("AAPL", Side::BUY, 100, 15000);
    engine.addOrder("AAPL", Side::SELL, 50, 15001);
    
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
    
    std::cout << "Processing time: " << duration.count() << " microseconds" << std::endl;
    return 0;
}
