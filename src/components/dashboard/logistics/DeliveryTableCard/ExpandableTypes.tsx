// components/ExpandableTypes.tsx

import { useState } from 'react';
import { Button } from 'antd';

type ExpandableTypesProps = {
  values: string[];
  limit?: number;
};

const ExpandableTypes = ({ values, limit = 10 }: ExpandableTypesProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!values || values.length === 0) return null;

  const visible = expanded ? values : values.slice(0, limit);

  return (
    <div>
      {visible.map((val, idx) => (
        <span key={idx} style={{ marginRight: 6 }}>
          {val}
        </span>
      ))}
      {values.length > limit && (
        <Button type="link" size="small" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Less' : 'More'}
        </Button>
      )}
    </div>
  );
};

export default ExpandableTypes;
