from django.contrib import admin

from products.models import Category, Feedback, Product, ProductAction, Rating

admin.site.register(Category)
admin.site.register(Feedback)
admin.site.register(Product)
admin.site.register(ProductAction)
admin.site.register(Rating)
