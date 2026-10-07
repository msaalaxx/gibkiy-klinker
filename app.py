from flask import Flask, render_template, abort

app = Flask(__name__)

# ---------- Контакты и цены (меняйте здесь) ----------
SITE = {
    "name": "Гибкий клинкер",
    "domain": "gibkiyclinker.ru",
    "address": "г. Грозный, Заводской район, ул. Назарбаева 3а",
    "phone": "8 937 000-33-44",
    "tel": "tel:+79370003344",
    "wa1": "https://wa.me/79370003344",
    "wa2": "https://wa.me/79288916045",
    "ig": "https://www.instagram.com/gibkiy_klinker95",
    "ig_name": "gibkiy_klinker95",
}
PRICE = {"kit": 1500, "plain": 1200, "glue": 4000, "finish": 4000}

# ---------- Отзывы ----------
# Базы данных нет. Отзывы, которые должны видеть ВСЕ посетители, добавляйте сюда вручную
# (после этого python freeze.py и push на GitHub). Пример:
# {"name": "Магомед А.", "rating": 10, "text": "Отличный клинкер!", "date": "07.10.2026"},
REVIEWS = []
REVIEW_MAX_LEN = 221  # максимум символов в отзыве (можно поставить 155)

# ---------- Товары: (название, цвет расшивки) ----------
_RAW = [
    ("Баварская кладка", "белая"), ("№11", "белая"), ("Красный цвет", "белая"),
    ("№9", "чёрная"), ("Бело-серый", "чёрная"), ("№2", "белая"),
    ("Caramel mix 2", "белая"), ("Светло-серый", "белая"), ("№3", "белая"),
    ("Тёмно-серый", "белая"), ("№9", "коричневая"), ("Чёрный", "белая"),
    ("№10", "белая"), ("Бело-серый", "белая"), ("№11", "чёрная"), ("Basis 2", "белая"),
]
PRODUCTS = [{"id": i + 1, "name": n, "grout": g} for i, (n, g) in enumerate(_RAW)]


@app.context_processor
def inject_globals():
    return {"site": SITE, "price": PRICE, "page": ""}


@app.route("/")
def index():
    return render_template("index.html", featured=PRODUCTS[:4], page="home")


@app.route("/catalog/")
def catalog():
    return render_template("catalog.html", products=PRODUCTS, page="cat")


@app.route("/reviews/")
def reviews():
    return render_template("reviews.html", reviews=REVIEWS, max_len=REVIEW_MAX_LEN, page="reviews")


@app.route("/product/<int:pid>/")
def product(pid):
    p = next((x for x in PRODUCTS if x["id"] == pid), None)
    if p is None:
        abort(404)
    return render_template("product.html", p=p, page="prod")


if __name__ == "__main__":
    app.run(debug=True)
