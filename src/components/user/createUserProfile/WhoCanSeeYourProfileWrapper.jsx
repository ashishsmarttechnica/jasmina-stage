import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import WhoCanSeeYourProfile from "./WhoCanSeeYourProfile";
import WhoCanSeeYourProfileForm from "./WhoCanSeeYourProfileForm";

const WhoCanSeeYourProfileWrapper = forwardRef(({ initialData }, ref) => {
  const [formData, setFormData] = useState({
    isPublic: true,
    isLGBTQFriendly: false,
    publicViewOption: 0,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        isPublic: initialData.isPublic ?? true,
        isLGBTQFriendly: initialData.onlyLGBTQFriendlyCompanies ?? false,
        publicViewOption: initialData.visibleTo ?? 0,
      });
    }
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      isPublic: formData.isPublic,
      onlyLGBTQFriendlyCompanies: formData.isLGBTQFriendly,
      visibleTo: formData.publicViewOption,
    }),
    setData: (data) => setFormData(data),
  }));

  return <WhoCanSeeYourProfileForm formData={formData} setFormData={setFormData} />;
});

export default WhoCanSeeYourProfileWrapper;
