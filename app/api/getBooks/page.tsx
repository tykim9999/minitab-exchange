'use client';

import { useState } from 'react';

type Styles = {
  container: React.CSSProperties;
  header: React.CSSProperties;
  form: React.CSSProperties;
  formGroup: React.CSSProperties;
  label: React.CSSProperties;
  input: React.CSSProperties;
  textarea: React.CSSProperties;
  select: React.CSSProperties;
  button: React.CSSProperties;
};

export default function HomePage() {
  const [formData, setFormData] = useState({
    members_name: '',
    members_phone_number: '',
    members_company: '',
    members_message: '',
    members_privacy_consent: 'X',  // 기본값
    members_book_received: 'X',    // 기본값
    members_winner_status: 'X',    // 기본값
    members_book_id: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setFormData({
          members_name: '',
          members_phone_number: '',
          members_company: '',
          members_message: '',
          members_privacy_consent: 'X',
          members_book_received: 'X',
          members_winner_status: 'X',
          members_book_id: ''
        });
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('회원 정보 저장에 실패했습니다.');
    }
  };

  const styles: Styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      color: '#000', // 검정색 글자
    },
    textarea: {
      width: '100%',
      padding: '8px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      minHeight: '100px',
      color: '#000', // 검정색 글자
    },
    select: {
      width: '100%',
      padding: '8px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      color: '#000', // 검정색 글자
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#0070f3',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>회원 정보 입력</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>이름:</label>
          <input
            type="text"
            name="members_name"
            value={formData.members_name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>전화번호:</label>
          <input
            type="text"
            name="members_phone_number"
            value={formData.members_phone_number}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>회사 이름:</label>
          <input
            type="text"
            name="members_company"
            value={formData.members_company}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>응원 문구:</label>
          <textarea
            name="members_message"
            value={formData.members_message}
            onChange={handleChange}
            style={styles.textarea}
            maxLength={300}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>개인정보 동의:</label>
          <select
            name="members_privacy_consent"
            value={formData.members_privacy_consent}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="O">동의</option>
            <option value="X">동의 안 함</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>책 수령 여부:</label>
          <select
            name="members_book_received"
            value={formData.members_book_received}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="O">수령</option>
            <option value="X">미수령</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>기프티콘 당첨 여부:</label>
          <select
            name="members_winner_status"
            value={formData.members_winner_status}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="O">당첨</option>
            <option value="X">미당첨</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>책 ID (선택 사항):</label>
          <input
            type="number"
            name="members_book_id"
            value={formData.members_book_id}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>제출</button>
      </form>
    </div>
  );
}
