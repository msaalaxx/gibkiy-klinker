"""Собирает статический сайт в папку docs/ для GitHub Pages."""
import shutil
from pathlib import Path
from flask_frozen import Freezer
from app import app, PRODUCTS, SITE

app.config["FREEZER_DESTINATION"] = "docs"
app.config["FREEZER_RELATIVE_URLS"] = True
app.config["FREEZER_REMOVE_EXTRA_FILES"] = True
freezer = Freezer(app)


@freezer.register_generator
def product():
    for p in PRODUCTS:
        yield {"pid": p["id"]}


if __name__ == "__main__":
    freezer.freeze()
    docs = Path("docs")
    (docs / "CNAME").write_text(SITE["domain"] + "\n", encoding="utf-8")
    (docs / ".nojekyll").write_text("", encoding="utf-8")
    print("Готово: папка docs/ собрана")
