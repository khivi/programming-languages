package com.khivi.lazysplit.test

import org.scalatest.FunSuite
import com.khivi.lazysplit.StreamSplit._

class LazySplitTest extends FunSuite {
  private val separator = ','

  test("Simple test") {
    def simpleTest[T](num: Int)(data: T) {
        val stream = Stream.fill(num)(data)
        val str: String = stream.mkString(separator.toString)
        val result: Stream[String]  = stream.map(_.toString)
        assert(str.splitAsStream(separator) === result)
    }
    List(1, "abc", 1.1).foreach {v =>
      simpleTest(10)(v)
    }
  }

  test("Infinite result test") {
    val result: Stream[String] = Stream.from(1).map(_.toString)
    val str: String = Stream.from(1).take(5).mkString(separator.toString)
    assert(str.splitAsStream(separator) != result)
  }
}
