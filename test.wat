(module
  (global $test (export "test")
    i32
    (i32.const 10))

  ;; var result = add(a, b)
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    (local $result i32)
    ;; return a + b
    (set_local $result
      (i32.add
        (get_local $a)
        (get_local $b)
      )
    )

    (return (get_local $result))
  )
)
