import type { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import './ShareFilter.css'

interface Props {
  value: number                      // текущее значение слайдера (минимальная доля, %)
  setValue: (value: number) => void  // изменение значения — состояние хранится в странице
  onSubmit: () => void               // нажатие «Найти» — страница выполняет запрос
  loading?: boolean                  // пока идёт запрос, кнопка неактивна
}

// Фильтр плитки по минимальной доле владения. Поиск — только по кнопке «Найти».
export const ShareFilter: FC<Props> = ({ value, setValue, onSubmit, loading }) => (
  <div className="shareFilter">
    <span className="shareFilterLabel">от {value}%</span>
    <Form.Range
      min={0}
      max={30}
      step={1}
      value={value}
      disabled={loading}
      onChange={(event) => setValue(Number(event.target.value))}
    />
    <Button className="shareFilterButton" disabled={loading} onClick={onSubmit}>
      Найти
    </Button>
  </div>
)
