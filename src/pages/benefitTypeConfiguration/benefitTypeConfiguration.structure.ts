import { custom } from './benefitTypeConfiguration.model';
import {
  FontSizeOutlined,
  ScheduleOutlined,
  NumberOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DownCircleOutlined,
} from '@ant-design/icons';

export const generalStructure: {
  custom: custom;
} = {
  custom: {
    TEXT: {
      type: 'TEXT',
      sub_type: '',
      title: 'Text',
      is_filled_by_admin: true,
      is_required: true,
      options: ['Short Text', 'Long Text'],
      icon: FontSizeOutlined,
    },
    NUMBER: {
      type: 'NUMBER',
      title: 'Number',
      options: ['Number', 'Percentage'],
      is_decimal_allowed: true,
      icon: NumberOutlined,
      precision: 6, // only 1 to 6 and null allowed
      is_range: true,
      sub_type: '',
      range_min: 0,
      range_max: 100,
      is_filled_by_admin: true,
      is_required: true,
    },
    DROPDOWN: {
      title: 'Dropdown',
      type: 'DROPDOWN',
      icon: DownCircleOutlined,
      options: ['Single Select', 'Multi Select'],
      source: ['Custom List', 'Reference Object'],
      is_custom_list: true,
      custom_list: [], // list of strings
      reference_object_id: -1,
      is_filled_by_admin: true,
      is_required: true,
      sub_type: '',
      isReferenceObjectRequired: true,
    },
    DATETIME: {
      type: 'DATETIME',
      icon: ScheduleOutlined,
      title: 'Date Time',
      is_filled_by_admin: true,
      is_required: true,
    },
    DATE: {
      type: 'DATE',
      title: 'Date',
      icon: CalendarOutlined,
      is_filled_by_admin: true,
      is_required: true,
    },
    TIME: {
      type: 'TIME',
      title: 'Time',
      icon: ClockCircleOutlined,
      is_range: true,
      range_min: '09',
      range_max: '23',
      is_filled_by_admin: true,
      is_required: true,
    },
  },
};
