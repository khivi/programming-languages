import re

class Data:

    def __init__(self, filename):
        self._filename = filename

    def count(self):
        with open(self._filename, 'r') as f:
            line = f.readline().rstrip()
            m = re.match(r'NUMBER=(\d+)', line)
            return int(m.group(1))

    def get(self, match):
        for line in open(self._filename, 'r'):
            m = re.match(match+':', line)
            if not m:
                continue
            numbers = line[m.end():]
            for n in Data.lazy_split(numbers):
                yield int(n)

    def output(self):
        return self.get('OUTPUT')

    def collections(self):
        count = self.count()
        return [self.get('COLLECTION'+ str(i)) for i in range(count)]

    @staticmethod
    def lazy_split(s, sep=','):
        exp = re.compile(re.escape(sep))
        pos = 0
        while True:
            m = exp.search(s, pos)
            if not m:
                if pos < len(s):
                    yield s[pos:]
                break
            if pos < m.start():
                yield s[pos:m.start()]
            pos = m.end()
