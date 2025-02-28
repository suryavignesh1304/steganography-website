from flask import Flask, request, jsonify, send_file
from PIL import Image
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Steganography functions
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
        if i + 8 <= len(binary_data):  # Make sure we have a full byte
            data += chr(int(byte, 2))
            if data.endswith('\x00'):  # Stop at null character
                return data.rstrip('\x00')

    return data

# Create output directory if it doesn't exist
os.makedirs('output', exist_ok=True)

@app.route('/api/hide-data', methods=['POST'])
def hide_data():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    image = request.files.get('image')

    if not image:
        return jsonify({'success': False, 'message': 'No image uploaded'})

    # Combine user data into a single string
    data = f"Username: {username}\nEmail: {email}\nPassword: {password}"

    # Save the uploaded image temporarily
    image_path = 'backend/temp_image.png'
    image.save(image_path)

    # Hide data in the image
    output_image_path = 'output/output_image.png'
    try:
        hide_data_in_image(image_path, data, output_image_path)
        # Clean up
        os.remove(image_path)
        return jsonify({'success': True, 'output_image': '/output_image.png'})
    except Exception as e:
        # Clean up
        if os.path.exists(image_path):
            os.remove(image_path)
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/extract-data', methods=['POST'])
def extract_data():
    image = request.files.get('image')

    if not image:
        return jsonify({'success': False, 'message': 'No image uploaded'})

    # Save the uploaded image temporarily
    image_path = 'backend/temp_image.png'
    image.save(image_path)

    try:
        # Extract data from the image
        extracted_data = extract_data_from_image(image_path)
        
        # Clean up
        os.remove(image_path)
        
        return jsonify({'success': True, 'data': extracted_data})
    except Exception as e:
        # Clean up
        if os.path.exists(image_path):
            os.remove(image_path)
        return jsonify({'success': False, 'message': str(e)})

@app.route('/output_image.png', methods=['GET'])
def get_output_image():
    return send_file('output/output_image.png', mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
