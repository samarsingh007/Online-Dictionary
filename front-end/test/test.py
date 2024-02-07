import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time


class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()

    def test_page_load(self):
        driver = self.driver

        #driver = webdriver.Chrome()
        time.sleep(3)
        driver.get("https://online-dictionary-frontend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/")
        # self.assertIn("Python", driver.title)
        elem = driver.find_element(By.ID, "online-dictionary")
        # elem.send_keys("apple")
        # elem.send_keys(Keys.RETURN)
        self.assertNotIn("No results found.", driver.page_source)
    
    def test_WOD(self):
        driver = self.driver

        #driver = webdriver.Chrome()
        time.sleep(5)
        
        driver.get("https://online-dictionary-frontend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/")
        # self.assertIn("Python", driver.title)
        elem = driver.find_element(By.XPATH, "/html/body/div[1]/main/div/div[1]/div/button/a")
        # elem.send_keys("apple")
        # elem.send_keys(Keys.RETURN)
        self.assertNotIn("No results found.", driver.page_source)
    
    def test_TOD(self):
        driver = self.driver

        #driver = webdriver.Chrome()
        time.sleep(3)
        driver.get("https://online-dictionary-frontend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/")
        # self.assertIn("Python", driver.title)
        elem = driver.find_element(By.XPATH, "/html/body/div[1]/main/div/div[2]/div/div[1]/button")
        
        # elem.send_keys("apple")
        # elem.send_keys(Keys.RETURN)
        self.assertNotIn("No results found.", driver.page_source)

    def test_search_word(self):
        driver = self.driver
        #driver = webdriver.Chrome()
        time.sleep(3)
        driver.get("https://online-dictionary-frontend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/")
        # self.assertIn("Python", driver.title)
        elem = driver.find_element(By.NAME, "word")
        elem.send_keys("apple")
        elem.send_keys(Keys.RETURN)

        self.assertNotIn("No results found.", driver.page_source)

    def test_clickStats(self):
        driver = webdriver.Chrome()
        driver.get("https://online-dictionary-frontend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/")
        # wait for the button to become clickable
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/header/div[3]/button[2]"))
        )
        # click the button
        button.click()
       
        driver.quit()

    def test_clickAddWords(self):
        driver = webdriver.Chrome()
        driver.get("https://online-dictionary-frontend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/")
        # wait for the button to become clickable
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/header/div[3]/button[1]"))
        )
        #click the button
        button.click()
       
        driver.quit()

    def test_clickWOD(self):
        driver = webdriver.Chrome()
        driver.get("https://online-dictionary-frontend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/")
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/header/div[3]/button[1]"))
        )
        button.click()
       
        driver.quit()

    def test_checkIfWODisClickable(self):

        driver = webdriver.Chrome()
        driver.get("https://online-dictionary-frontend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/")
        # wait for the button to become clickable
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/main/div/div[1]/div/div[2]/button/a"))
        )
        button.click()
        tag_name = "h2"
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, tag_name))
        )
        elements = driver.find_elements(By.TAG_NAME, tag_name)
        assert len(elements) > 0
        driver.quit()


    def tearDown(self):
        self.driver.close()

    
    

if __name__ == "__main__":
    unittest.main()
    
