// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module sui::test_coin {
    use std::option;
    use sui::coin::{Self, Coin};
    use sui::pay;
    use sui::url;
    use sui::test_scenario;
    use sui::transfer;
    use sui::tx_context;
    use std::string;
    use std::ascii;

    struct TEST_COIN has drop {}

    const TEST_ADDR: address = @0xA11CE;

    #[test]
    fun test_coin_metadata() {
        let scenario = test_scenario::begin(TEST_ADDR);
        let test = &mut scenario;
        let ctx = test_scenario::ctx(test);
        let witness = TEST_COIN{};
        let (treasury, metadata) = coin::create_currency(witness, 6, b"TEST_COIN", b"coin_name", b"description", option::some(url::new_unsafe_from_bytes(b"icon_url")), ctx);

        let decimals = coin::get_decimals(&metadata);
        let symbol_bytes = ascii::as_bytes(&coin::get_symbol<TEST_COIN>(&metadata));
        let name_bytes = string::bytes(&coin::get_name<TEST_COIN>(&metadata));
        let description_bytes = string::bytes(&coin::get_description<TEST_COIN>(&metadata));
        let icon_url = ascii::as_bytes(&url::inner_url(option::borrow(&coin::get_icon_url<TEST_COIN>(&metadata))));

        assert!(decimals == 6, 0);
        assert!(*symbol_bytes == b"TEST_COIN", 0);
        assert!(*name_bytes == b"coin_name", 0);
        assert!(*description_bytes == b"description", 0);
        assert!(*icon_url == b"icon_url", 0);

        // Update
        coin::update_symbol<TEST_COIN>(&treasury, &mut metadata, ascii::string(b"NEW_TEST_COIN"));
        coin::update_name<TEST_COIN>(&treasury, &mut metadata, string::utf8(b"new_coin_name"));
        coin::update_description<TEST_COIN>(&treasury, &mut metadata, string::utf8(b"new_description"));
        coin::update_icon_url<TEST_COIN>(&treasury, &mut metadata, ascii::string(b"new_icon_url"));

        let symbol_bytes = ascii::as_bytes(&coin::get_symbol<TEST_COIN>(&metadata));
        let name_bytes = string::bytes(&coin::get_name<TEST_COIN>(&metadata));
        let description_bytes = string::bytes(&coin::get_description<TEST_COIN>(&metadata));
        let icon_url = ascii::as_bytes(&url::inner_url(option::borrow(&coin::get_icon_url<TEST_COIN>(&metadata))));

        assert!(*symbol_bytes == b"NEW_TEST_COIN", 0);
        assert!(*name_bytes == b"new_coin_name", 0);
        assert!(*description_bytes == b"new_description", 0);
        assert!(*icon_url == b"new_icon_url", 0);

        transfer::freeze_object(metadata);
        transfer::transfer(treasury, tx_context::sender(ctx));
        test_scenario::end(scenario);
    }

    #[test]
    fun test_coin_mint() {
        let scenario = test_scenario::begin(TEST_ADDR);
        let test = &mut scenario;
        let witness = TEST_COIN{};
        let (treasury, metadata) = coin::create_currency(witness, 6, b"TEST_COIN", b"coin_name", b"description", option::some(url::new_unsafe_from_bytes(b"icon_url")), test_scenario::ctx(test));

        let balance = coin::mint_balance<TEST_COIN>(&mut treasury, 1000);
        let coin = coin::from_balance(balance, test_scenario::ctx(test));
        let value = coin::value(&coin);
        assert!(value == 1000, 0);
        pay::keep(coin, test_scenario::ctx(test));

        coin::mint_and_transfer<TEST_COIN>(&mut treasury, 42, TEST_ADDR, test_scenario::ctx(test));
        test_scenario::next_epoch(test, TEST_ADDR); // needed or else we won't have a value for `most_recent_id_for_address` coming up next.
        let coin = test_scenario::take_from_address<Coin<TEST_COIN>>(test, TEST_ADDR);
        let value = coin::value(&coin);
        assert!(value == 42, 0);
        pay::keep(coin, test_scenario::ctx(test));

        transfer::freeze_object(metadata);
        transfer::transfer(treasury, tx_context::sender(test_scenario::ctx(test)));
        test_scenario::end(scenario);
    }
}
