import sys

def fetch_code():
    # err if missing a source file
    if len(sys.argv) < 2:
        raise RuntimeError(f'Cannot compile\nMissing .gs file')

    # return source code from file
    filename = sys.argv[1]

    # validate file extension
    extension = filename[len(filename)-2:]
    if extension != "gs":
        raise RuntimeError(f'Your code must be written in a .gs file')

    # return source code
    print(f"Reading code from: {filename}")
    with open(filename, "r") as f:
        return f.read()
