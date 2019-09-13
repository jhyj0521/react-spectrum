import CalendarIcon from '@spectrum-icons/workflow/Calendar';
import {classNames, filterDOMProps} from '@react-spectrum/utils';
import {DatePickerField} from './DatePickerField';
import datepickerStyles from './index.css';
import {Dialog, DialogTrigger} from '@react-spectrum/dialog';
import {FieldButton} from '@react-spectrum/button';
import {FocusRing, FocusScope, useFocusManager} from '@react-aria/focus';
import {RangeCalendar} from '@react-spectrum/calendar';
import React, {useRef} from 'react';
import {SpectrumDateRangePickerProps} from './types';
import styles from '@adobe/spectrum-css-temp/components/inputgroup/vars.css';
import {useDateRangePicker} from '@react-aria/datepicker';
import {useDateRangePickerState} from '@react-stately/datepicker';
import {useLocale} from '@react-aria/i18n';

export function DateRangePicker(props: SpectrumDateRangePickerProps) {
  let {
    isQuiet,
    isDisabled,
    isReadOnly,
    isRequired,
    autoFocus,
    formatOptions,
    placeholderDate,
    className,
    ...otherProps
  } = props;
  let state = useDateRangePickerState(props);
  let {comboboxProps, buttonProps, dialogProps, startFieldProps, endFieldProps} = useDateRangePicker(props, state);
  let {value, setDate, selectDateRange, isOpen, setOpen} = state;
  let targetRef = useRef<HTMLDivElement>();
  let {direction} = useLocale();

  className = classNames(
    styles,
    'spectrum-InputGroup',
    'spectrum-Datepicker--range',
    {
      'spectrum-InputGroup--quiet': isQuiet,
      'is-invalid': state.validationState === 'invalid',
      'is-disabled': isDisabled
    },
    className
  );

  return (
    <FocusRing 
      within
      focusClass={classNames(styles, 'is-focused')}
      focusRingClass={classNames(styles, 'focus-ring')}>
      <div 
        {...filterDOMProps(otherProps)}
        {...comboboxProps}
        className={className}
        ref={targetRef}>
        <FocusScope autoFocus={autoFocus}>
          <DatePickerField
            {...startFieldProps}
            isQuiet={props.isQuiet}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isRequired={isRequired}
            formatOptions={formatOptions}
            placeholderDate={placeholderDate}
            value={value.start}
            onChange={start => setDate('start', start)}
            className={classNames(styles, 'spectrum-Datepicker-startField')} />
          <DateRangeDash />
          <DatePickerField
            {...endFieldProps}
            isQuiet={props.isQuiet}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isRequired={isRequired}
            validationState={state.validationState}
            formatOptions={formatOptions}
            placeholderDate={placeholderDate}
            value={value.end}
            onChange={end => setDate('end', end)}
            className={classNames(
              styles,
              'spectrum-Datepicker-endField',
              classNames(
                datepickerStyles,
                'react-spectrum-Datepicker-endField'
              )
            )} />
        </FocusScope>
        <DialogTrigger 
          type="popover"
          mobileType="tray"
          placement={direction === 'rtl' ? 'bottom right' : 'bottom left'}
          targetRef={targetRef}
          hideArrow
          isOpen={isOpen}
          onOpenChange={setOpen}>
          <FieldButton
            {...buttonProps}
            className={classNames(styles, 'spectrum-FieldButton')}
            isQuiet={isQuiet}
            validationState={state.validationState}
            icon={<CalendarIcon />}
            isDisabled={isDisabled || isReadOnly} />
          <Dialog className={classNames(datepickerStyles, 'react-spectrum-Datepicker-dialog')} {...dialogProps}>
            <RangeCalendar
              autoFocus
              value={value}
              onChange={selectDateRange} />
          </Dialog>
        </DialogTrigger>
      </div>
    </FocusRing>
  );
}

function DateRangeDash() {
  let focusManager = useFocusManager();
  let onMouseDown = (e) => {
    e.preventDefault();
    focusManager.focusNext({from: e.target});
  };

  return (
    <div 
      role="presentation"
      data-testid="date-range-dash"
      className={classNames(styles, 'spectrum-Datepicker--rangeDash')}
      onMouseDown={onMouseDown} />
  );
}