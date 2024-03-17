import React, { useEffect, useState } from "react";

const UserTimeZone = () => {
  const [userTimeZone, setUserTimeZone] = useState(null);

  useEffect(() => {
    const getUserTimeZone = () => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimeZone(timeZone);
    };

    getUserTimeZone();
  }, []);

  return (
    <div className="pl-2">
      <p>Your Timezone: {userTimeZone}</p>
    </div>
  );
};

export default UserTimeZone;
