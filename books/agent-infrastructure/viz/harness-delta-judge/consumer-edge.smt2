; Two-unit model. The structure check consumes chapter text.
(set-logic QF_UF)
(declare-const chapter_changed Bool)
(declare-const registered_edge Bool)
(define-fun structure_required () Bool chapter_changed)
(define-fun structure_selected () Bool (and chapter_changed registered_edge))
(assert (and structure_required (not structure_selected)))
(check-sat)
(get-value (chapter_changed registered_edge structure_required structure_selected))
