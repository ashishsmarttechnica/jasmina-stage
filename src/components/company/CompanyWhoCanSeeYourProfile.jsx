"use client";
import { useRouter } from "@/i18n/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

const CompanyWhoCanSeeYourProfile = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    isPublic: true,
    isLGBTQFriendly: false,
    publicViewOption: 0,
  });
  const [agreedToLGBTQCommitment, setAgreedToLGBTQCommitment] = useState(false);

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Cookies.set("profileCreated", true);
    router.push("/company/feed");
  };

  return (
    <div>
      {/* <div className="my-6 sm:mt-10">
        <ReusableForm
          title="Who can see your profile"
          subtitle="Choose your profile visibility and safe typreferences"
        > */}
      {/* Toggle - Make profile public */}

      {/* Public View Options */}

      {/* Toggle - LGBTQ Friendly */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-start gap-2 sm:w-auto sm:items-center">
          <div>
            <p className="mt-2 flex items-start gap-2 pl-2 sm:pr-0">
              <input
                type="checkbox"
                checked={agreedToLGBTQCommitment}
                onChange={() => setAgreedToLGBTQCommitment(!agreedToLGBTQCommitment)}
                className="mt-7 accent-green-600"
                id="lgbtq-commitment-checkbox"
              />
              <label htmlFor="lgbtq-commitment-checkbox" className="mt-5 text-xs text-gray-500">
                By activating this, Our company commits to being LGBTQ+ inclusive and operating in a
                country that respects LGBTQ+ rights. We agree to provide documentation upon request
                and await admin approval
              </label>
            </p>
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center self-end sm:self-auto">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={formData.isLGBTQFriendly}
            onChange={() => updateField("isLGBTQFriendly", !formData.isLGBTQFriendly)}
          />
          <div className="peer peer-checked:bg-primary relative h-6 w-11 rounded-full bg-gray-200 peer-focus:outline-none after:absolute after:h-6 after:w-6 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="btn-fill cursor-pointer"
        disabled={!agreedToLGBTQCommitment}
      >
        next
      </button>
      {/* </ReusableForm>
      </div> */}
    </div>
  );
};

export default CompanyWhoCanSeeYourProfile;
