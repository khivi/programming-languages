



class Merge:
    def __init__(self, lists):
        self._lists = lists
        self._len =  len(lists)
        self._nexts = [None] * self._len

    def _next(self):
        nexts = self._nexts
        for idx in range(self._len):
            value = nexts[idx]
            if value == StopIteration:
                continue
            if value is None:
                try:
                    value = next(self._lists[idx])
                except StopIteration:
                    value = StopIteration
                finally:
                    nexts[idx] = value

    def generator(self):
        while True:
            self._next()
            min_idx = None
            nexts = self._nexts
            for idx in range(self._len):
                value = nexts[idx]
                if value == StopIteration:
                    continue
                if min_idx is None or value < nexts[min_idx]:
                    min_idx = idx

            if min_idx is not None:
                min_value = nexts[min_idx]
                nexts[min_idx] = None
                yield min_value
            else:
                break
