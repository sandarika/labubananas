import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager


@pytest.mark.selenium
def test_swagger_ui_loads(live_server):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
    try:
        driver.set_page_load_timeout(20)
        driver.get(f"{live_server}/docs")
        # Assert Swagger UI heading present
        h1 = driver.find_element(By.CSS_SELECTOR, "#swagger-ui .topbar .link span")
        assert "Swagger" in h1.text
    finally:
        driver.quit()
