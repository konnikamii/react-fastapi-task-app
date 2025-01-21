
import atexit
import json
import logging.config
import logging.handlers
import pathlib
from ..config import settings
import os
logger_auth = logging.getLogger("logger_auth")
logger_db = logging.getLogger('logger_db')
logger_sys = logging.getLogger('logger_sys')

# ROOT_PATH = settings.root_path
ROOT_PATH = os.path.join(os.path.dirname(__file__), '../..')

# D:\PyFiles\FastAPIweb\website\logger\queued-stderr-json-file.json


def setup_logging():
    config_file = pathlib.Path(
        f"{ROOT_PATH}/website/logger/queued-stderr-json-file.json")
    with open(config_file) as f_in:
        config = json.load(f_in)

    logging.config.dictConfig(config)
    queue_handler = logging.getHandlerByName("queue_handler")
    if queue_handler is not None:
        queue_handler.listener.start()
        atexit.register(queue_handler.listener.stop)


def main():
    setup_logging()
    logging.basicConfig(level="INFO")


setup_logging()
main()
if __name__ == "__main__":
    main()
