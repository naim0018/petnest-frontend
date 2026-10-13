import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PetFilterState {
  selectedType: string; // 'all' or category id like 'dogs', 'birds'
  selectedTypeLabel: string;
  selectedBreed: string; // 'all' or breed id like 'budgie'
  selectedBreedLabel: string;
  image?: string;
}

const initialState: PetFilterState = {
  selectedType: "birds",
  selectedTypeLabel: "Birds",
  selectedBreed: "all",
  selectedBreedLabel: "All Birds",
  image: "/CareGuide/categories/bird.png",
};

export const petFilterSlice = createSlice({
  name: "petFilter",
  initialState,
  reducers: {
    setPetFilter: (
      state,
      action: PayloadAction<{
        typeId: string;
        typeLabel: string;
        breedId: string;
        breedLabel: string;
        image?: string;
      }>
    ) => {
      state.selectedType = action.payload.typeId;
      state.selectedTypeLabel = action.payload.typeLabel;
      state.selectedBreed = action.payload.breedId;
      state.selectedBreedLabel = action.payload.breedLabel;
      state.image = action.payload.image;
    },
    resetPetFilter: (state) => {
      state.selectedType = "all";
      state.selectedTypeLabel = "All Pets";
      state.selectedBreed = "all";
      state.selectedBreedLabel = "All";
      state.image = undefined;
    },
  },
});

export const { setPetFilter, resetPetFilter } = petFilterSlice.actions;
export default petFilterSlice.reducer;
