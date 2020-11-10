# 学习笔记

## 语言的分类

- 结构化语言

  自然语言

- 非结构化语言（乔姆


## BNF 产生式

带括号的四则运算：

    <expression>          := <parenthesis> | <additive> | <productive> | <number>
    <additive-operator>   := "+" | "-"
    <productive-operator> := "*" | "/"
    <additive-rhs>        := <number> | <productive> | <parenthesis>
    <additive>            := <expression> <additive-operator> <additive-rhs>
    <productive-lhs>      := <number> | <parenthesis> | <productive>
    <productive-rhs>      := <number> | <parenthesis>
    <productive>          := <productive-lhs> <productive-operator> <productive-rhs>
    <calculate>           := <additive> | <productive>
    <parenthesis>         := "(" <calculate> ")"

- number 不是 additive 或者 productive。
- 括号不能加在数字上。

## 编程语言分类

- 用途

  数据描述语言：JSON、JSON5、Postscript、PDF、Yaml、Toml、BSON、Pickle、MessagePack、RON、URL、XML、CSS、ini、csv、SQL。

  编程语言：汇编、C、C++、C#、F#、Java、Clojure、Scala、Python、Ruby、Lua、Javascript、Bash、Fish、BrainFuck、Whitespace、CommonLisp、Scheme、Racket、Haskell、D、Go、Rust、MetaLanguage、OCaml、Prolog、Ada、Fortran、Perl、Perl6、Dart、Swift、Objective-C、Kotlin。

- 范式

  声明式语言：上述所有数据描述语言、Haskell、Prolog、OCaml、Clojure。

  命令式语言：上述其余编程语言。
