from django import forms
from .models import Image
from django.core.files.base import ContentFile
from django.utils.text import slugify
import requests


class ImageCreateForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = ['title', 'url', 'description']
        widgets = {
            'url': forms.HiddenInput, # виджет прорисовывается как HTML-элемент input с атрибутом type="hidden"
        }
    
    # метод clean_<fieldname>() исполняется для каждого поля при его наличии, когда is_valid() вызывается на экземпляре формы
    def clean_url(self):
        url = self.cleaned_data['url']
        valid_extensions = ['jpg', 'jpeg', 'png']
        extension = url.rsplit('.', 1)[1].lower()
        if extension not in valid_extensions:
            raise forms.ValidationError('The given URL does not ' \
                                        'match valid image extensions.')
        return url

    def save(self, force_insert=False,
                   force_update=False,
                   commit=True):
        image = super().save(commit=False)
        image_url = self.cleaned_data['url']
        name = slugify(image.title)
        extension = image_url.rsplit('.', 1)[1].lower()
        image_name = f'{name}.{extension}'
        # скачать изображение с данного URL-адреса

        response = requests.get(image_url)
        image.image.save(image_name,
                         ContentFile(response.content),
                         save=False)
        # объект ContentFile, экземпляр которого заполнен содержимым скачанного файла
        # Параметр save=False передается для того, чтобы избежать сохранения объекта в базе данных

        if commit:
            image.save()
        return image
