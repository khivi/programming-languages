import unittest

from file import Data

class TestData(unittest.TestCase):
    def test_data(self):
        data = Data('../data/test.txt')
        assert data.count() == 3

    def test_split(self):
        l = list(Data.lazy_split('1,2,3'))
        l = [int(i) for i in l]
        assert l == [1, 2, 3]

    def test_lines(self):
        data = Data('../data/test.txt')
        numbers = data.get('COLLECTION0')
        assert list(numbers) == [1, 2, 3, 4, 7, 9]
        numbers = data.get('OUTPUT')
        assert list(numbers) == [1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21]
        collections = data.collections()
        assert list(collections[2]) == [1, 21]
