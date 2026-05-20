from unittest.mock import patch


# --- Root ---

def test_root_returns_200(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


# --- Input validation ---

def test_search_missing_query_returns_422(client):
    assert client.get("/api/search").status_code == 422

def test_search_empty_query_returns_422(client):
    assert client.get("/api/search?q=").status_code == 422

def test_search_query_too_long_returns_422(client):
    assert client.get(f"/api/search?q={'a' * 201}").status_code == 422

def test_suggest_missing_query_returns_422(client):
    assert client.get("/api/suggest").status_code == 422

def test_describe_missing_query_returns_422(client):
    assert client.get("/api/describe").status_code == 422

def test_stocks_missing_ticker_returns_422(client):
    assert client.get("/api/stocks").status_code == 422

def test_stocks_ticker_too_long_returns_422(client):
    assert client.get(f"/api/stocks?ticker={'A' * 11}").status_code == 422


# --- Response shape ---

@patch("app.routes.search.search_news", return_value=[])
def test_search_response_has_expected_keys(mock_news, client):
    response = client.get("/api/search?q=Apple")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Apple"
    for key in ("sentiment", "keywords", "news_articles", "summary"):
        assert key in data

@patch("app.routes.search.search_news", return_value=[])
def test_search_logs_to_db(mock_news, client):
    client.get("/api/search?q=uniquetestquery123")
    trending = client.get("/api/trending-searches").json()
    queries = [t["query"] for t in trending]
    assert "uniquetestquery123" in queries


# --- Trending searches ---

def test_trending_searches_returns_list(client):
    response = client.get("/api/trending-searches")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_trending_searches_shape(client):
    response = client.get("/api/trending-searches")
    for item in response.json():
        assert "query" in item
        assert "count" in item


# --- Security ---

def test_cors_blocks_unknown_origin(client):
    response = client.get("/api/trending-searches", headers={"Origin": "https://evil.com"})
    assert "access-control-allow-origin" not in response.headers
