package com.pricewise.adapter;

import java.util.List;

public interface PriceDataAdapter {

    String getProviderCode();

    List<AdapterProduct> fetchProducts(String query);

    List<AdapterOffer> fetchOffers(String externalProductId);
}
