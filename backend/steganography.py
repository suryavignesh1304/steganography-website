from PIL import Image

def hide_data_in_image(image_path, data, output_path):
    image = Image.open(image_path)
    binary_data = ''.join(format(ord(char), '08b') for char in data)
    data_len = len(binary_data)

    # Ensure the image can hold the data
    if data_len > image.width * image.height * 3:
        raise ValueError("Image is too small to hold the data")

    index = 0
    pixels = list(image.getdata())

    for i, pixel in enumerate(pixels):
        if index >= data_len:
            break
        new_pixel = list(pixel)
        for j in range(3):  # RGB channels
            if index < data_len:
                new_pixel[j] = new_pixel[j] & ~1 | int(binary_data[index])
                index += 1
        pixels[i] = tuple(new_pixel)

    new_image = Image.new(image.mode, image.size)
    new_image.putdata(pixels)
    new_image.save(output_path)

def extract_data_from_image(image_path):
    image = Image.open(image_path)
    pixels = list(image.getdata())
    binary_data = ''

    for pixel in pixels:
        for value in pixel[:3]:  # RGB channels
            binary_data += str(value & 1)

    # Convert binary data to string
    data = ''
    for i in range(0, len(binary_data), 8):
        byte = binary_data[i:i+8]
        data += chr(int(byte, 2))
        if data.endswith('\x00'):  # Stop at null character
            return data.rstrip('\x00')

    return data