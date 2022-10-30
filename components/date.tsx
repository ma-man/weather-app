import { addWeeks, format} from 'date-fns'
import React from 'react'

export function returnIsoDate () {
    const date = new Date()
    const startDate = format(date, 'yyyy-MM-dd')
    const endDate = format(addWeeks(date, 1), 'yyyy-MM-dd')

    return{
        startDate,
        endDate
    }
}