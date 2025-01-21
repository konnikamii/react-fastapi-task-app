from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey
from dotenv import load_dotenv
import os
# from config import settings

# Load .env
dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path)

ENCRYPTION_PASSWORD_PRIVATE_KEY = os.getenv("ENCRYPTION_PASSWORD_PRIVATE_KEY")

# Generate private key /w serialization
private_key = Ed25519PrivateKey.generate()
pem_private_key = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.BestAvailableEncryption(
        ENCRYPTION_PASSWORD_PRIVATE_KEY.encode('utf-8'))
)

# Generate public key
public_key = private_key.public_key()
pem_public_key = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

# Get the directory of the current script
script_dir = os.path.dirname(__file__)

# Construct the file paths
private_key_path = os.path.join(script_dir, 'private_key.pem')
public_key_path = os.path.join(script_dir, 'public_key.pem')


# Save keys to files
with open(private_key_path, 'wb') as f:
    f.write(pem_private_key)

with open(public_key_path, 'wb') as f:
    f.write(pem_public_key)

print('Success!')


# --------------------------------LOADING--------------------------------#
# # How to load them back
# loaded_private_key = Ed25519PrivateKey.from_private_bytes(pem_private_key)
# loaded_public_key = Ed25519PublicKey.from_public_bytes(pem_public_key)

# # private_key(signature)
# signature = private_key.sign(b"my authenticated message")

# # Raises InvalidSignature if verification fails
# public_key.verify(signature, b"my authenticated message")


# # Loading the private key from a PEM file
# with open('private_key.pem', 'rb') as f:
#     pem_data = f.read()
#     loaded_private_key = serialization.load_pem_private_key(
#         pem_data,
#         # Use the password argument if the private key is encrypted
#         password=ENCRYPTION_PASSWORD_PRIVATE_KEY.encode('utf-8'),
#         backend=None  # Default backend
#     )

# # Loading the public key from a PEM file
# with open('public_key.pem', 'rb') as f:
#     pem_data = f.read()
#     loaded_public_key = serialization.load_pem_public_key(
#         pem_data,
#         backend=None  # Default backend
#     )
