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
import {
    catalogueDataVacancies, isLoadingVacancies,
    jobAreaVacancies,
    paymentFromVacancies, paymentToVacancies
} from "2-BLL/vacanciesSlice/vacancies.selectors";
import {vacanciesActions} from "2-BLL/vacanciesSlice/vacancies.slice";
import {useStyles} from './styleFilters';

export const Filters = () => {

    const dispatch = useAppDispatch()

    const catalogueDataText = useAppSelector(catalogueDataVacancies).map(catalogue => catalogue['title_rus'])
    const paymentFrom = useAppSelector(paymentFromVacancies)
    const paymentTo = useAppSelector(paymentToVacancies)
    const jobArea = useAppSelector(jobAreaVacancies)
    const isLoading = useAppSelector(isLoadingVacancies)

    const [jobAreaValue, setJobAreaValue] = useState<string>(jobArea);
    const [minSalaryValue, setMinSalaryValue] = useState<number | ''>(paymentFrom === '' ? '' : paymentFrom);
    const [maxSalaryValue, setMaxSalaryValue] = useState<number | ''>(paymentTo === '' ? '' : paymentFrom);

    const [vacancyAriaSelectOpen, setVacancyAriaSelectOpen] = useState<boolean>(false);

    const {classes, cx} = useStyles();

    const selectDataAttribute = {'data-elem': 'industry-select'}
    const minSalaryInputDataAttribute = {'data-elem': 'salary-from-input'}
    const maxSalaryInputDataAttribute = {'data-elem': 'salary-to-input'}
    const useFiltersDataAttribute = {'data-elem': 'search-button'}

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
                {...selectDataAttribute}
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
                    {...minSalaryInputDataAttribute}
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
                    {...maxSalaryInputDataAttribute}
                />
            </Box>
            <Button disabled={isLoading} onClick={setFiltersButtonHandler}
                    className={classes.filterButton}
                    {...useFiltersDataAttribute}>
                Применить
            </Button>
        </Container>
    );
};
