import { useMemo, useState } from 'react';
import Loader from './Loader';

const initialValues = {
  age: '', gender: '', country: '', academic_level: '', most_used_platform: '',
  purpose_of_use: '', avg_daily_usage_hours: '', daily_unlocks: '', study_hours: '',
  physical_activity_hours: '', sleep_hours_per_night: '', stress_level: '',
};

const selectOptions = {
  gender: ['Male', 'Female'],
  academic_level: ['Undergraduate', 'Graduate', 'High School'],
  most_used_platform: ['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter', 'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp', 'WeChat'],
  purpose_of_use: ['Networking', 'Education', 'Entertainment', 'News'],
  stress_level: ['Low', 'Medium', 'High', 'Very High'],
};

const fieldInfo = [
  ['age', 'Age', 'number', '10 – 100'], ['gender', 'Gender', 'select'], ['country', 'Country', 'text', 'e.g. Pakistan'],
  ['academic_level', 'Academic level', 'select'], ['most_used_platform', 'Most used platform', 'select'], ['purpose_of_use', 'Purpose of use', 'select'],
  ['avg_daily_usage_hours', 'Average daily usage', 'number', 'Hours per day'], ['daily_unlocks', 'Daily phone unlocks', 'number', 'Times per day'],
  ['study_hours', 'Study hours', 'number', 'Hours per day'], ['physical_activity_hours', 'Physical activity', 'number', 'Hours per day'],
  ['sleep_hours_per_night', 'Sleep per night', 'number', 'Hours'], ['stress_level', 'Stress level', 'select'],
];

const formSections = [
  { number: '01', title: 'Profile', subtitle: 'A few details about you', fields: ['age', 'gender', 'country'] },
  { number: '02', title: 'Academic & Digital Habits', subtitle: 'Your day-to-day digital routine', fields: ['academic_level', 'most_used_platform', 'purpose_of_use', 'avg_daily_usage_hours', 'daily_unlocks', 'study_hours'] },
  { number: '03', title: 'Lifestyle & Stress', subtitle: 'How you recharge and feel', fields: ['physical_activity_hours', 'sleep_hours_per_night', 'stress_level'] },
];

function validate(values) {
  const errors = {};
  Object.entries(values).forEach(([key, value]) => {
    if (String(value).trim() === '') errors[key] = 'This field is required.';
  });
  const inRange = (name, low, high, label) => {
    const value = Number(values[name]);
    if (values[name] !== '' && (!Number.isFinite(value) || value < low || value > high)) errors[name] = `${label} must be between ${low} and ${high}.`;
  };
  inRange('age', 10, 100, 'Age');
  ['avg_daily_usage_hours', 'study_hours', 'physical_activity_hours', 'sleep_hours_per_night'].forEach((name) => inRange(name, 0, 24, 'Value'));
  if (values.daily_unlocks !== '' && (!Number.isInteger(Number(values.daily_unlocks)) || Number(values.daily_unlocks) < 0)) errors.daily_unlocks = 'Daily unlocks cannot be negative.';
  if (values.country && values.country.trim().length < 2) errors.country = 'Please enter a valid country.';
  return errors;
}

export default function PredictionForm({ onSubmit, loading, requestError, onReset }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  const update = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  };
  const markTouched = (event) => setTouched((previous) => ({ ...previous, [event.target.name]: true }));
  const submit = (event) => {
    event.preventDefault();
    setTouched(Object.fromEntries(Object.keys(values).map((key) => [key, true])));
    if (!isValid) return;
    const payload = {
      ...values,
      age: Number(values.age), daily_unlocks: Number(values.daily_unlocks),
      avg_daily_usage_hours: Number(values.avg_daily_usage_hours), study_hours: Number(values.study_hours),
      physical_activity_hours: Number(values.physical_activity_hours), sleep_hours_per_night: Number(values.sleep_hours_per_night),
      country: values.country.trim(),
    };
    onSubmit(payload);
  };
  const reset = () => { setValues(initialValues); setTouched({}); onReset(); };
  const renderField = (name) => {
    const [, label, type, hint] = fieldInfo.find(([fieldName]) => fieldName === name);
    const error = touched[name] && errors[name];
    return <div className={`field ${error ? 'has-error' : ''}`} key={name}>
      <label htmlFor={name}>{label}</label>
      {type === 'select' ? <select id={name} name={name} value={values[name]} onChange={update} onBlur={markTouched} aria-invalid={Boolean(error)}><option value="">Select an option</option>{selectOptions[name].map((option) => <option key={option}>{option}</option>)}</select> : <div className="input-shell"><input id={name} name={name} type={type} value={values[name]} onChange={update} onBlur={markTouched} placeholder={hint} min={type === 'number' ? 0 : undefined} step={name.includes('hours') ? '0.1' : '1'} aria-invalid={Boolean(error)} />{name.includes('hours') && <span>hrs</span>}</div>}
      {error && <small className="error-text">{error}</small>}
    </div>;
  };

  return (
    <form className="prediction-form" onSubmit={submit} noValidate>
      <div className="form-heading">
        <div><p className="eyebrow">Personal wellbeing profile</p><h2>Tell us about your routine</h2></div>
        <span className="steps">12 fields</span>
      </div>
      <div className="form-sections">
        {formSections.map((section, index) => <section className="form-section" key={section.number} style={{ '--section-delay': `${index * 90}ms` }}>
          <div className="section-label"><span>{section.number}</span><div><h3>{section.title}</h3><p>{section.subtitle}</p></div></div>
          <div className="form-grid">{section.fields.map(renderField)}</div>
        </section>)}
      </div>
      {requestError && <div className="request-error" role="alert"><span>!</span>{requestError}</div>}
      <div className="form-actions">
        <button type="button" className="reset-button" onClick={reset} disabled={loading}>Reset form</button>
        <button type="submit" className="predict-button" disabled={!isValid || loading}>{loading ? <Loader /> : <>Predict my score <span>→</span></>}</button>
      </div>
    </form>
  );
}
