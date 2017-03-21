import unittest

from merge import Merge

class TestMerge(unittest.TestCase):
    def test_numbers(self):
        lists = ((1,2), (2,3,5), (3,4))
        lists = [iter(l) for l in lists]
        merge = Merge(lists)
        generator = merge.generator()
        assert(list(generator) == [1,2,2,3,3,4,5])

