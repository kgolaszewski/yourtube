from django.core.management.base import BaseCommand

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from webdriver_manager.firefox import GeckoDriverManager

from youtube.models import Youtuber, Video
from datetime import datetime

def test_scrape():

    options = FirefoxOptions()
    options.add_argument("--headless")
    driver = webdriver.Firefox(executable_path=GeckoDriverManager().install(), options=options)

    # Wait up to 60 seconds, but continue if you find the element
    driver.implicitly_wait(60)

    youtubers = [x for x in Youtuber.objects.all()]

    for youtuber in youtubers:
        driver.get(youtuber.channel)
        latest = driver.find_element(By.ID, "video-title")

        result = {}
        result["video_id"] = latest.get_attribute("href").split("=")[1]

        if youtuber.last_upload != result["video_id"]:
            result["title"]    = latest.get_attribute("title")
            result["youtuber"] = youtuber.username

            driver.get(f"https://youtube.com/watch?v={result['video_id']}")
            result["date"] = datetime.strptime(driver.find_element(By.ID, "info-strings").text, "%b %d, %Y")
        print(youtuber.name, result)

        # new = Video(
        #         video_id=result.video_id,
        #         title=result.title,
        #         date=result.date,
        #         youtuber=result.youtuber,
        # )
        # new.save()
        # youtuber.last_upload = result.last_upload
        # youtuber.save()


class Command(BaseCommand):
    help = "Check youtube.com for latest upload from each Youtuber"    
    # define logic of command
    def handle(self, *args, **options):
        test_scrape()
        self.stdout.write( 'job complete' )