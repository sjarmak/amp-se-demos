package com.amp.fintech.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
public class AccountController {
  private final JdbcTemplate jdbc;
  public AccountController(JdbcTemplate jdbc){ this.jdbc = jdbc; }

  @GetMapping("/health")
  public Map<String, Object> health(){ return Map.of("ok", true); }

  @GetMapping("/accounts")
  public List<Map<String,Object>> accounts(){
    return jdbc.queryForList("SELECT id, customer_id, balance_cents, status FROM accounts ORDER BY id");
  }
}
