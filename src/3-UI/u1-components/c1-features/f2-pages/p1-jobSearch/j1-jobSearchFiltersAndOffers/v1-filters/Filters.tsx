import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Container,
    NumberInput,
    rem,
    Select,
    Title
} from "@mantine/core";
import {ChevronDown} from 'tabler-icons-react';
import {useAppDispatch, useAppSelector} from "2-BLL/store";
import {vacanciesActions} from "2-BLL/vacanciesSlice/vacancies.slice";
import {useStyles} from './styleFilters';
import {useLazyGetCataloguesQuery} from "2-BLL/vacanciesSlice/service/catalogues.slice";

export const Filters = () => {

    const dispatch = useAppDispatch()
    const isLoading = useAppSelector(state => state.vacancies.isLoading)
    const paymentTo = useAppSelector(state => state.vacancies.payment_to)
    const paymentFrom = useAppSelector(state => state.vacancies.payment_from)
    const jobArea = useAppSelector(state => state.vacancies.jobArea)

    const [jobAreaValue, setJobAreaValue] = useState<string>('');
    const [minSalaryValue, setMinSalaryValue] = useState<number | ''>('');
    const [maxSalaryValue, setMaxSalaryValue] = useState<number | ''>('');
    const [vacancyAriaSelectOpen, setVacancyAriaSelectOpen] = useState<boolean>(false);

    const {classes, cx} = useStyles();

    const setFiltersButtonHandler = () => {
        dispatch(vacanciesActions.setFilters({
            payment_from: minSalaryValue,
            payment_to: maxSalaryValue,
            catalogues: jobAreaValue
        }))
    }

    const removeAllFiltersButtonHandler = () => {
        dispatch(vacanciesActions.setFilters({catalogues: '', payment_from: '', payment_to: ''}))
        dispatch(vacanciesActions.setKeyWord({keyWord: ''}))
    }

    const styleSelectButton = !vacancyAriaSelectOpen ?
        {color: '#ACADB9', transition: '0.2s all'} :
        {color: '#5E96FC', transform: 'rotate(180deg)', transition: '0.2s all'}

    useEffect(() => {
        setJobAreaValue(jobArea)
        setMinSalaryValue(paymentFrom)
        setMaxSalaryValue(paymentTo)
    }, [paymentFrom, paymentTo, jobArea])

    const [getCataloguesData,{data: cataloguesData}] = useLazyGetCataloguesQuery()

    let catalogueDataText = cataloguesData ? cataloguesData.map(catalogue => catalogue['title_rus']) : []

    useEffect(() => {
        getCataloguesData({})
            .then((res)=> {
                dispatch(vacanciesActions.setCatalogueData({data: res.data!}))
            })
    }, [])

    return (
        <Container className={classes.filtersContainer}>
            <Box className={classes.filterTitle}>
                <Title className={classes.filterTitleText} order={2}>Фильтры</Title>
                <Button className={classes.filterTitleButton}
                        onClick={removeAllFiltersButtonHandler}>Сбросить данные
                    <div className={classes.filterTitleButtonCross}/>
                </Button>
            </Box>
            <Select
                className={classes.vacancyAriaSelect}
                onClick={() => setVacancyAriaSelectOpen(!vacancyAriaSelectOpen)}
                onBlur={() => setVacancyAriaSelectOpen(false)}
                size={'md'}
                label="Отрасль"
                placeholder="Выберете отрасль "
                searchable
                clearable
                onSearchChange={setJobAreaValue}
                searchValue={jobAreaValue}
                nothingFound="Проверьте выбранную отрасль"
                data={catalogueDataText}
                transitionProps={{transition: 'pop-top-left', duration: 200, timingFunction: 'ease'}}
                rightSection={<ChevronDown style={styleSelectButton} size={'1rem'}/>}
                rightSectionWidth={48}
                styles={(theme) => ({
                    rightSection: {pointerEvents: 'none'},
                    item: {
                        width: '97%',
                        fontSize: `${rem(14)}`,
                        fontFamily: 'Inter, sans-serif',
                        fontStyle: 'normal',

                        '&[data-hovered]': {
                            backgroundColor: '#DEECFF;',
                            color: '#232134',
                        },
                        '&[data-selected]': {
                            '&, &:hover': {
                                backgroundColor: '#5E96FC;',
                                color: 'white'
                            },
                        },
                    },
                })}
            />
            <Box>
                <NumberInput
                    placeholder="От"
                    label="Оклад"
                    styles={{control: {border: 'none'}}}
                    className={classes.salaryInput}
                    min={0}
                    value={minSalaryValue}
                    onChange={(value) => {
                        setMinSalaryValue(value)
                        value > maxSalaryValue && setMaxSalaryValue(value)
                    }}
                    step={1000}
                />
                <NumberInput
                    placeholder="До"
                    styles={{control: {border: 'none'}}}
                    className={`${classes.salaryInput}  ${classes.salaryInputMax}`}
                    min={0}
                    value={maxSalaryValue}
                    onChange={(value) => {
                        setMaxSalaryValue(value)
                        value < minSalaryValue && setMinSalaryValue(value);
                    }}
                    step={1000}
                />
            </Box>
            <Button disabled={isLoading} onClick={setFiltersButtonHandler}
                    className={classes.filterButton}
            >
                Применить
            </Button>
        </Container>
    );
};
