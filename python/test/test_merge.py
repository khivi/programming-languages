import unittest
import sys

from merge import Merge
from file import Data

class TestMerge(unittest.TestCase):
    def test_numbers(self):
        lists = ((1,2), (2,3,5), (3,4))
        lists = [iter(l) for l in lists]
        merge = Merge(lists)
        generator = merge.generator()
        assert(list(generator) == [1,2,2,3,3,4,5])

    def test_strings(self):
        lists = (("b","e"), ("c","d"), ("a","z"))
        lists = [iter(l) for l in lists]
        merge = Merge(lists)
        generator = merge.generator()
        assert(list(generator) == ['a', 'b', 'c','d','e','z'])

    def test_infinity(self):
        def infinity(value):
            while True:
                yield value

        merge = Merge((infinity(1), infinity(2)))
        generator = merge.generator()
        assert(next(generator) == 1)

    def test_range(self):
        cnt = 5
        lists = [ iter(xrange(sys.maxint)) for _ in range(cnt) ]
        merge = Merge(lists)
        generator = merge.generator()
        for value in range(10):
            for _ in range(cnt):
                assert(next(generator) == value)

    @staticmethod
    def merge_file(filename):
        data = Data(filename)
        output = data.get('OUTPUT')
        collections = data.collections()
        merge = Merge(collections)
        generator = merge.generator()
        return (generator, output)

    def test_data(self):
        generator, output = TestMerge.merge_file('../data/test.txt')
        assert(list(generator) == list(output))

    def test_error(self):
        generator, output = TestMerge.merge_file('../data/err.txt')
        assert(next(generator) != next(output))
        assert(next(generator) != next(output))
        assert(next(generator) != next(output))
