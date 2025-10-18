// components/approvers-form.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X, UserRoundPlus } from 'lucide-react';

interface FRAMEWORKS {
  value: string,
  label: string,
  name: string,
  email: string
}

interface RecipientItem {
  id: number;
  value: string;
  selectedRecipient?: FRAMEWORKS;
}

export function ApproversForm() {
  const ReciptientList: FRAMEWORKS[] = [
    {
      value: "director",
      label: "Director",
      name: "Abhnav",
      email: "abhnav@vepolink.in"
    },
    {
      value: "CEO",
      label: "CEO",
      name: "Abhi",
      email: "abhi@vepolink.in"
    },
    {
      value: "voice president",
      label: "Voice President",
      name: "Arvind",
      email: "arvind@vepolink.in"
    },
    {
      value: "sales manager",
      label: "Sales Manager",
      name: "Abhinav",
      email: "abhinav@vepolink.in"
    }
  ];

  const [recipients, setRecipients] = useState<RecipientItem[]>([{ id: 1, value: "" }]);
  const [searchResults, setSearchResults] = useState<FRAMEWORKS[]>([]);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveSearchIndex(null);
        setSearchResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get currently selected recipient values to prevent duplicates
  const getSelectedRecipientValues = (currentIndex: number): string[] => {
    return recipients
      .filter((_, index) => index !== currentIndex)
      .map(recipient => recipient.selectedRecipient?.value)
      .filter(Boolean) as string[];
  };

  function handleSearchSelect(value: string, index: number) {
    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    const alreadySelectedValues = getSelectedRecipientValues(index);

    const filtered = ReciptientList.filter(item =>
      (item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.label.toLowerCase().includes(value.toLowerCase())) &&
      !alreadySelectedValues.includes(item.value)
    );
    setSearchResults(filtered);
  }

  function handleSelectRecipient(recipient: FRAMEWORKS, index: number) {
    const updatedRecipients = [...recipients];
    updatedRecipients[index] = {
      ...updatedRecipients[index],
      value: recipient.name,
      selectedRecipient: recipient
    };
    setRecipients(updatedRecipients);
    setSearchResults([]);
    setActiveSearchIndex(null);
  }

  function addNewRecipient() {
    const newId = recipients.length > 0 ? Math.max(...recipients.map(r => r.id)) + 1 : 1;
    setRecipients([...recipients, { id: newId, value: "" }]);
  }

  function handleRemoveButton(index: number) {
    // If there's only one recipient field, just clear it
    if (recipients.length === 1) {
      clearSelection(index);
    }
    // If there are multiple fields, remove this one
    else {
      removeRecipient(recipients[index].id);
    }
  }

  function removeRecipient(id: number) {
    if (recipients.length > 1) {
      setRecipients(recipients.filter(recipient => recipient.id !== id));
    }
  }

  function handleInputChange(value: string, index: number) {
    const updatedRecipients = [...recipients];
    updatedRecipients[index] = {
      ...updatedRecipients[index],
      value,
      // Clear selected recipient when user starts typing
      selectedRecipient: value === "" ? undefined : updatedRecipients[index].selectedRecipient
    };
    setRecipients(updatedRecipients);

    setActiveSearchIndex(index);
    handleSearchSelect(value, index);
  }

  function clearSelection(index: number) {
    const updatedRecipients = [...recipients];
    updatedRecipients[index] = {
      id: updatedRecipients[index].id,
      value: "",
      selectedRecipient: undefined
    };
    setRecipients(updatedRecipients);
    setSearchResults([]);
    setActiveSearchIndex(null);
  }

  // Filter search results to exclude already selected recipients
  const getFilteredSearchResults = (currentIndex: number) => {
    const alreadySelectedValues = getSelectedRecipientValues(currentIndex);
    return searchResults.filter(result =>
      !alreadySelectedValues.includes(result.value)
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="w-full">
        {recipients.map((recipient, index) => (
          <div key={recipient.id} className="w-full relative mb-4">
            <div className="flex flex-row space-x-2">
              <div className="w-[38px] h-[36px] border rounded bg-slate-50 text-black flex flex-col text-center justify-center">
                {index + 1}
              </div>
              <div className="flex-1 relative" ref={dropdownRef}>
                <Input
                  className="border rounded w-full"
                  placeholder="Enter name here"
                  value={recipient.value}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onFocus={() => setActiveSearchIndex(index)}
                />

                {/* Dropdown when user Search */}
                {activeSearchIndex === index && getFilteredSearchResults(index).length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1">
                    <div className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {getFilteredSearchResults(index).map((result) => (
                        <div
                          key={result.value}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            handleSelectRecipient(result, index);
                          }}
                        >
                          <div className="font-medium text-gray-900">{result.name}</div>
                          <div className="text-sm text-gray-600">{result.email}</div>
                          <div className="text-xs text-gray-500">{result.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show message when no results or all are already selected */}
                {activeSearchIndex === index && searchResults.length > 0 && getFilteredSearchResults(index).length === 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1">
                    <div className="bg-white border border-gray-300 rounded-md shadow-lg p-3">
                      <div className="text-sm text-gray-500 text-center">
                        All matching recipients are already selected
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-[38px] h-[36px]">
                <Button
                  className="rounded cursor-pointer"
                  onClick={() => handleRemoveButton(index)}
                  disabled={recipients.length === 1}
                  variant={"outline"}
                  size="icon"
                  type="button"
                  title={recipients.length > 1 ? "Remove recipient" : "Clear selection"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Show selected recipient details */}
            {/* {recipient.selectedRecipient && (
              <div className="ml-12 mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Selected: </span>
                  {recipient.selectedRecipient.name} ({recipient.selectedRecipient.email}) - {recipient.selectedRecipient.label}
                </div>
              </div>
            )} */}
          </div>
        ))}

        <div
          className="flex flex-row space-x-2 cursor-pointer mt-2.5 items-center text-blue-600 hover:text-blue-800"
          onClick={addNewRecipient}
        >
          <UserRoundPlus className="size-5" />
          <div className="font-medium">Add additional recipient</div>
        </div>
      </div>
    </div>
  );
}