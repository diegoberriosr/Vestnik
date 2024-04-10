import mimetypes

def post_image_to_bucket(s3, image, object, name, path):
    image.seek(0)
    mime_type, _ = mimetypes.guess_type(image.name)
    file_extension = mimetypes.guess_extension(mime_type)
    s3_name = f'{path}/{name}{file_extension}'

    s3.upload_fileobj(
        image,
        'vestnik-image-storage',
        s3_name
    )

    s3_link = f'https://s3.amazonaws.com/vestnik-image-storage/{s3_name}'
    
    if hasattr(object, 'image'):
        object.image = s3_link
    
    else:
        object.pfp = s3_link

