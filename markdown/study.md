1. 教程
    - mocha教程见官网及阮大大的链接
    - Istanbul是代码覆盖率的package，具体教程同上（[阮一峰](http://www.ruanyifeng.com/blog/2015/06/istanbul.html)）

    注意： 代码覆盖率测试的时候，发现
    ```
    No coverage information was collected, exit without writing coverage information
    ```
    试了很多种都不行。最后fix的solution是
    ```
    //装下babel-cli，然后把Istanbul换成babel-istanbul,windows下面的话可能么有_mocha，要具体到node_modules
    "test:cover": "babel-node ./node_modules/.bin/babel-istanbul cover _mocha ./test/main.test.js"
    ```
